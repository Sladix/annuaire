import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<h1>Annuaire</h1>
				<nav>
					<Link activeClassName={style.active} href="/">Accueil</Link>
					<Link activeClassName={style.active} href="/about">À propos</Link>
				</nav>
			</header>
		);
	}
}
