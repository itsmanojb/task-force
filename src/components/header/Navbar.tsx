import { NavLink } from "react-router-dom";
import "./Header.css";
import { useContext } from "react";
import { DropdownContext } from "@/context/DropdownContext";

type NavbarProps = {
  children: React.ReactNode;
};

type NavItemProps = {
  label: string;
  children?: React.ReactNode;
  link?: string;
  icon?: any;
  klass?: string;
};

export const Navbar = ({ children }: NavbarProps) => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{children}</ul>
    </nav>
  );
};

export const NavItem = ({
  children,
  link,
  icon,
  label,
  klass = "icon-button",
}: NavItemProps) => {
  const [open, setOpen] = useContext(DropdownContext);

  return link ? (
    <li className="nav-item">
      <NavLink to={link} className={klass}>
        {icon} {label}
      </NavLink>
    </li>
  ) : (
    <li className="nav-item">
      <a className={klass} onClick={() => setOpen(!open)}>
        {icon} {label}
      </a>
      {open && children}
    </li>
  );
};
