import React, { Component } from 'react';
import './NodeBox.css';

class NodeBox extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}
	render() {
		return (
			<div className='canvas-box'>
				<canvas 
					onClick={this.props.onNodeClick}
				></canvas>
			</div>
		)
	}

	componentDidUpdate() {
		const {canvas, nodeArray} = this.props
		nodeArray.forEach(node => {
			node.drawNode()
			node.drawEdges()
		})
	}
}

export default NodeBox;