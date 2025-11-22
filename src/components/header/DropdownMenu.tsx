import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { useAppUI } from "@/context/AppUIContext";
import { useAuth } from "@/context/AuthContext";
import { DropdownContext } from "@/context/DropdownContext";
import { Board, Project } from "@/types/model";
import { getBoards } from "@/utils/data";
import Icon from "@/components/misc/IonIcon";

type DropdownMenuProps = {
  items: any[];
  current: any;
  setProject: (p: Project | null) => void;
};

export const DropdownMenu = ({
  items,
  current,
  setProject,
}: DropdownMenuProps) => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [, setOpen] = useContext(DropdownContext);
  const [activeMenu, setActiveMenu] = useState("main");
  const [menuHeight, setMenuHeight] = useState();
  const [boards, setBoards] = useState<Board[]>([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight((dropdownRef.current as any)?.firstChild?.offsetHeight + 32);
  }, []);

  useEffect(() => {
    if (current) {
      getBoards(currentUser!.email!, current.id)
        .then((boards) => {
          setBoards(boards);
        })
        .catch(() => {
          setBoards([]);
        });
    }
  }, [currentUser, current]);

  function calcHeight(el: any) {
    const height = el.offsetHeight;
    setMenuHeight(height + 32);
  }

  function setCurrentProject(project: Project) {
    setOpen(false);
    setProject(project);
    localStorage.setItem("currentProject", JSON.stringify(project));
    navigate(`/s/project/${project.id}`);
  }

  function resetProject() {
    localStorage.removeItem("currentProject");
    navigate(`/s/dashboard`);
    setProject(null);
    setOpen(false);
  }

  function setBoard(board: Board) {
    navigate(`/s/board/${board.id}`, { state: { boardName: board.name } });
    setOpen(false);
  }

  const DropdownItem = (props: any) => {
    const { children, link, goToMenu, leftIcon, rightIcon, role, item } = props;
    const [appUI, , actions] = useAppUI();

    function handleClick(e: any) {
      if (role === "SET_PROJECT") {
        setCurrentProject(item);
      } else if (role === "RESET_PROJECT") {
        resetProject();
      } else if (role === "CREATE_BOARD") {
        actions.setModal("addboard");
        setOpen(false);
      } else if (role === "SET_BOARD") {
        setBoard(item);
        setOpen(false);
      }
    }

    return link ? (
      <NavLink to={link} className="menu-item">
        {leftIcon && <span className="icon-button">{leftIcon}</span>}
        {children}
        <span className="icon-right">{rightIcon}</span>
      </NavLink>
    ) : (
      <a
        className="menu-item"
        onClick={(e) => (goToMenu ? setActiveMenu(goToMenu) : handleClick(e))}
      >
        {leftIcon && <span className="icon-button">{leftIcon}</span>}
        {children}
        <span className="icon-right">{rightIcon}</span>
      </a>
    );
  };

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <div className="overscroll">
            {current ? (
              <>
                <div className="overscroll">
                  <DropdownItem
                    leftIcon={<Icon name="folder-outline" />}
                    rightIcon={<Icon name="chevron-forward" />}
                    goToMenu="boards"
                  >
                    {current.name}
                  </DropdownItem>
                  <span className="divider"></span>
                  {items
                    .filter(
                      (item) => current.name !== item.name && !item.archived,
                    )
                    .map((item, i) => (
                      <DropdownItem
                        key={i}
                        leftIcon={<Icon name="folder-outline" />}
                        role={"SET_PROJECT"}
                        item={item}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
                </div>
                <span className="divider"></span>
                <DropdownItem
                  leftIcon={<Icon name="chevron-back" />}
                  role={"RESET_PROJECT"}
                >
                  Projects Home
                </DropdownItem>
              </>
            ) : (
              <>
                {items
                  .filter((item) => !item.archived)
                  .map((item, i) => (
                    <DropdownItem
                      key={i}
                      leftIcon={<Icon name="folder-outline" />}
                      role={"SET_PROJECT"}
                      item={item}
                    >
                      {item.name}
                    </DropdownItem>
                  ))}
              </>
            )}
            {/* <DropdownItem leftIcon={<Icon name="person-outline" />}>{currentUser.displayName}</DropdownItem> */}
          </div>
        </div>
      </CSSTransition>

      {current && (
        <CSSTransition
          in={activeMenu === "boards"}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="menu">
            <DropdownItem
              goToMenu="main"
              leftIcon={<Icon name="chevron-back" />}
            >
              Back to {current.name}
            </DropdownItem>
            <span className="divider"></span>
            {boards.map((board, i) => (
              <DropdownItem
                key={i}
                leftIcon={<Icon name="clipboard-outline" />}
                role={"SET_BOARD"}
                item={board}
              >
                {board.name}
              </DropdownItem>
            ))}
            <DropdownItem leftIcon={<Icon name="add" />} role={"CREATE_BOARD"}>
              Create new board
            </DropdownItem>
          </div>
        </CSSTransition>
      )}

      {/* <CSSTransition
        in={activeMenu === 'settings'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<Icon name="chevron-back" />}>
            <h2>Settings</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<Icon name="shield-checkmark-outline" />} link='/'>Change Password</DropdownItem>
        </div>
      </CSSTransition> */}
    </div>
  );
};
