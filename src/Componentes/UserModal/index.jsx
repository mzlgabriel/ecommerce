import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Contextos/AuthContext";

import { SettingsIcon } from "../Icones/Settings";
import { UserIcon } from "../Icones/User";
import { UserCircleIcon } from "../Icones/UserCircle";
import { BoxIcon } from "../Icones/Box";
import { Truck2Icon } from "../Icones/Truck2";
import { LogoutIcon } from "../Icones/Logout";
import { CloseIcon } from "../Icones/Close";

import styles from './styles.module.scss'

export function UserModal() {
  const { user, logout } = useAuth();

  let nome = user?.Nome.split(" ")[0];

  const [isMobile, setIsMobile] = useState(false);
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const handleLogOut = () => logout();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setClick(false);
  }, [pathname]);

  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkWindowSize);

    checkWindowSize();

    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, [])

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdown_link} onClick={handleClick}>
        <UserIcon />
      </div>
      {isMobile ? (
        <div style={click ? { display: 'block' } : { display: 'none' }} className={styles.dropdown_content}>
          <div className={styles.user}>
            <div>
              <UserCircleIcon />
              <span>Olá, {nome}</span>
            </div>
            <div>
              <button onClick={handleClick}><CloseIcon /></button>
            </div>
          </div>

          <div className={styles.user__menu}>
            <ul>
              <li>
                <Link to="/minha-conta">
                  <SettingsIcon /> Minha conta
                </Link>
              </li>

              <li>
                <Link onClick={() => handleLogOut()}>
                  <LogoutIcon /> Sair
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className={styles.dropdown_content}>
          <div className={styles.user}>
            <UserCircleIcon />
            <span>Olá, {nome}</span>
          </div>

          <div className={styles.user__menu}>
            <ul>
              <li>
                <Link to="/minha-conta">
                  <SettingsIcon /> Minha conta
                </Link>
              </li>

              <li>
                <Link onClick={() => handleLogOut()}>
                  <LogoutIcon /> Sair
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}