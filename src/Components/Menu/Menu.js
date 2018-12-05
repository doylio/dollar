import React from 'react';
import './Menu.css';

const Menu = () => {
	return (
		<nav>
			<header>
				<h1>The Dollar Game</h1>
				<h3>As seen on <a href="https://www.youtube.com/watch?v=U33dsEcKgeQ&t=228s">Numberphile</a></h3>
			</header>
			<div className='menu-btn'>
				<h2>Reset</h2>
			</div>
			<div className='menu-btn'>
				<h2>New</h2>
			</div>
			<div className='menu-btn'>
				<h4>
					# of Nodes (2-20)
					<input 
						type='number'
						min='2'
						max='20'
					></input>
				</h4>
			</div>
			<div className='menu-btn'>
				<h4>Total Money</h4>
			</div>
		</nav>
	)
}

export default Menu;