import React, { Component } from 'react';
import logo from './logo.svg';
import Menu from './Components/Menu/Menu.js';
import NodeBox from './Components/NodeBox/NodeBox.js';

class App extends Component {
  constructor() {
    super()
    this.state = {
      winner: false,
    }
  }

  render() {
    return (
      <div className='container'>
        <Menu />
        <NodeBox onNodeClick={this.onNodeClick} canvas={this.state.canvas} nodeArray={this.state.nodeArray} />
      </div>
    );
  }

  componentDidMount() {
    this.init()
  }


  onNodeClick = (evt) => {
    const rect = this.state.canvas.getBoundingClientRect()
    const x = evt.clientX - rect.left
    const y = evt.clientY - rect.top
    const { nodeArray } = this.state
    const nIndex = nodeArray.findIndex(node => Math.sqrt((node.x - x)**2 + (node.y - y)**2) < 40)
    if(nIndex === -1) {
      return
    }

    //Set give or take mode
    let Q = 1
    if(evt.shiftKey){ Q = -1 }

    nodeArray[nIndex].value += Q * nodeArray[nIndex].edges.length
    nodeArray[nIndex].edges.forEach(i => nodeArray[i].value -= Q * 1)
    this.setState({nodeArray})
    this.winCheck(nodeArray)
  }

  winCheck = (arr) => {
    if(arr.findIndex(n => n.value < 0) === -1) {
      this.setState({winner: true})
    }
  }

  init = () => {
    const NUMBER_OF_NODES = 20
    const WIDTH = document.querySelector('.canvas-box').offsetWidth
    const HEIGHT = document.querySelector('.canvas-box').offsetHeight
    const GENUS_MODIFIER = 3
    const canvas = document.querySelector('canvas')
    canvas.width = WIDTH
    canvas.height = HEIGHT
    const c = canvas.getContext('2d')

    let nodeArray = createGraph(NUMBER_OF_NODES)
    while(!isConnected(nodeArray)) {
      nodeArray = createGraph(NUMBER_OF_NODES)
    }

    //Assign the values to each node, such that it can be solved
    let money = NUMBER_OF_NODES * 5 + calculateGenus(nodeArray) + GENUS_MODIFIER
    while(money > 0) {
      let nd = Math.floor(Math.random() * NUMBER_OF_NODES)
      nodeArray[nd].value += 1
      money--
    }

    this.setState({canvas, nodeArray})


    function Node(x, y, value) {
      this.x = x
      this.y = y
      this.value = -5 //This is changed later in init function
      this.edges = []
      this.drawNode = () => {
        c.fillStyle = '#1a0d00'
        c.beginPath()
        c.arc(this.x, this.y, 40, 0, 2 * Math.PI)
        c.fill()
        c.fillStyle = '#FFF'
        c.font = '40px Segoe Print serif'
        c.textAlign = 'center'
        c.fillText(this.value, this.x, this.y + 15)
      }
      this.drawEdges = () => {
        this.edges.forEach(n => {
          const BUFFER = 35
          let h = dist(this, nodeArray[n])
          let dx = BUFFER / h * (nodeArray[n].x - this.x)
          let dy = BUFFER / h * (nodeArray[n].y - this.y)
          c.beginPath()
          c.moveTo(this.x + dx, this.y + dy)
          c.lineTo(nodeArray[n].x - dx, nodeArray[n].y - dy)
          c.strokeStyle = '#1a0d00'
          c.lineWidth = 8
          c.stroke()
        })
      }
    }

    function dist(n1, n2) {
      return Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2)
    }

    function edgeBlocked(nodeArray, a, b) {
      const n1 = nodeArray[a]
      const n2 = nodeArray[b]
      const n1_n2_angle = Math.atan((n2.y - n1.y) / (n2.x - n1.x))

      for(let i = 0; i < nodeArray.length; i++) {
        //Skip n1 and n2
        if(i === a || i === b) {
          continue
        }
        let ni = nodeArray[i]
        let n1_ni_angle = Math.atan((ni.y - n1.y) / (ni.x - n1.x))
        let theta = n1_ni_angle - n1_n2_angle
        let perpendicular_intercept = dist(n1, ni) * Math.sin(theta)
        if(Math.abs(perpendicular_intercept) < 50) {
          return true
        }
      }
      return false
    }

    function createGraph(NUMBER_OF_NODES) {
      const EDGE_DENSITY = 0.3
      //Creates the requested number of non-overlapping nodes
      const nodeArray = []
      while(nodeArray.length < NUMBER_OF_NODES) {
        let x = Math.floor((WIDTH - 80) * Math.random() + 40)
        let y = Math.floor((HEIGHT - 80) * Math.random() + 40)
        let node = new Node(x, y)

        let overlapping = false
        for(let i = 0; i < nodeArray.length; i++) {
          if(dist(nodeArray[i], node) < 100) {
            overlapping = true
            break
          }
        }
        if(!overlapping) {
          nodeArray.push(node)
        }
      }

      for(let i = 0; i < nodeArray.length; i++) {
        for(let j = 0; j < i; j++) {
          if(Math.random() > EDGE_DENSITY) {
            continue
          }
          if(edgeBlocked(nodeArray, i, j)){
            continue
          }

          nodeArray[i].edges.push(j)
          nodeArray[j].edges.push(i)
        }
      }
      return nodeArray
    }

    function isConnected(nodeArray) {
      let toSearch = [0]
      let visited = []
      while(toSearch.length) {
        let current = toSearch.pop()
        nodeArray[current].edges.forEach(nd => {
          if(!visited.includes(nd) && !toSearch.includes(nd)) {
            toSearch.push(nd)
          }
        })
        visited.push(current)
      }
      return visited.length === nodeArray.length
    }

    function calculateGenus(nodeArray) {
      const edges = nodeArray.reduce((total, node) => total + node.edges.length, 0) / 2
      return edges - nodeArray.length + 1
    }
  }
}

export default App;
