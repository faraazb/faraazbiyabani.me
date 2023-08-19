import React, { useCallback, useEffect, useState } from "react";
import "./header.scss";
import { Link } from "gatsby";
import { LinkWrapper } from "../button";
import { Menu } from "@headlessui/react";
import { darkThemeIcon, hamburgerIcon, lightThemeIcon, logo } from "../icons";
import { useTheme } from "../../theme/theme-provider";

const Header = () => {
  const isBrowser = typeof window !== "undefined";
  const { theme, switchTheme } = useTheme();
  const [scrollDirection, setScrollDirection] = useState("");

  let supportPageOffset, isCSS1Compat;
  if (isBrowser) {
    supportPageOffset = window.scrollX !== undefined;
    isCSS1Compat = (document.compatMode || "") === "CSS1Compat";
  }

  const getScrollY = useCallback(() => {
    if (!isBrowser) {
      return;
    }
    return supportPageOffset
      ? window.scrollY
      : isCSS1Compat
      ? document.documentElement.scrollTop
      : document.body.scrollTop;
  }, [isCSS1Compat, supportPageOffset, isBrowser]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const threshold = 100;

    let previousScrollY = getScrollY();
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = getScrollY();

      if (Math.abs(scrollY - previousScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDirection(
        scrollY > previousScrollY ? "scroll-down" : "scroll-up",
      );
      previousScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion && !reducedMotion.matches) {
      window.addEventListener("scroll", onScroll);
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection, getScrollY, isBrowser]);

  let switchThemeIcon = theme === "light" ? darkThemeIcon : lightThemeIcon;

  return (
    <header id="nav-header" className={scrollDirection}>
      <div className="logo">
        <Link
          to="/"
          id="logo-link"
          draggable={false}
          aria-label="Link to home page"
        >
          {logo}
        </Link>
      </div>
      <div className="nav-links">
        <button
          title="Switch Theme"
          className="nav-link icon-button"
          onClick={switchTheme}
          tabIndex={0}
        >
          {switchThemeIcon}
        </button>
        <Link to="/#about" className="nav-link">
          About
        </Link>
        <Link to="/#projects" className="nav-link">
          Projects
        </Link>
        <Link to="/resume" className="nav-link">
          Resume
        </Link>
        <Link to="#contact" className="nav-link">
          Contact
        </Link>
      </div>
      <Menu as={React.Fragment}>
        {({ open }) => (
          <>
            <Menu.Button as={React.Fragment} tabIndex={0}>
              <div className="nav-button">{hamburgerIcon}</div>
            </Menu.Button>
            {open && (
              <div className="nav-menu">
                <Menu.Items static className="nav-menu-items">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "item-active" : ""
                        } nav-menu-item icon-button`}
                        onClick={switchTheme}
                        aria-label="Switch theme"
                      >
                        {switchThemeIcon}
                        <span className="icon-button-label">Switch Theme</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <LinkWrapper
                        className={`${
                          active ? "item-active" : ""
                        } nav-menu-item`}
                        href={"/#about"}
                      >
                        About
                      </LinkWrapper>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <LinkWrapper
                        className={`${
                          active ? "item-active" : ""
                        } nav-menu-item`}
                        href={"/#projects"}
                      >
                        Projects
                      </LinkWrapper>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <LinkWrapper
                        className={`${
                          active ? "item-active" : ""
                        } nav-menu-item`}
                        href={"/resume"}
                      >
                        Resume
                      </LinkWrapper>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <LinkWrapper
                        className={`${
                          active ? "item-active" : ""
                        } nav-menu-item`}
                        href={"#contact"}
                      >
                        Contact
                      </LinkWrapper>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </div>
            )}
          </>
        )}
      </Menu>
    </header>
  );
};

export default Header;
