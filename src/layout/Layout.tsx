import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import SvgIcon from '../components/ui/SvgIcon';
import { Logo } from '../assets/icons';

export function Layout() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		document.body.classList.toggle(styles.menuOpen);
	};

	return (
		<div>
			<header className={styles.head}>
				<div className={styles.headerLogo}>
					<Link to="/">
						<SvgIcon
						iconUrl={Logo}
						height={49}
						width={46} 
						/>
					</Link>
				</div>
				<div 
					className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} 
					onClick={toggleMenu}
				>
					<span></span>
					<span></span>
					<span></span>
				</div>
				<nav className={`${styles.headerNav} ${isMenuOpen ? styles.active : ''}`}>
					<ul className={styles.headerMenu}>
						<li className={styles.headerMenuItem}>
							<Link to="/" className={styles.headerLink} onClick={toggleMenu}>
              Characters
							</Link>
						</li>
						<li className={styles.headerMenuItem}>
							<Link to="/locations" className={styles.headerLink} onClick={toggleMenu}>
              Locations
							</Link>
						</li>
						<li className={styles.headerMenuItem}>
							<Link to="/episodes" className={styles.headerLink} onClick={toggleMenu}>
              Episodes
							</Link>
						</li>
					</ul>
				</nav>
			</header>
			<Outlet/>
		</div>
	);
}