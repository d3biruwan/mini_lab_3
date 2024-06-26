import * as css from './index.css'
import Viva from "vivagraphjs";


export default class App {
  constructor (elem) {
    if (!elem) return
    this.elem = elem
    this.defaultIconSize = 50
    this.defaultURL = "https://ibb.co/68dTG9c"
    
    this.graphics = Viva.Graph.View.svgGraphics();
    this.graphics.node(function(node) {
     // The function is called every time renderer needs a ui to display node
     return Viva.Graph.svg('image')
           .attr('width', node.data["size"])
           .attr('height', node.data["size"])
           .link((node.data && node.data.url))
      // node.data holds custom object passed to graph.addNode();
      })
      .placeNode(function(nodeUI, pos, node){
          // Shift image to let links go to the center:
          nodeUI.attr('x', pos.x - 0.5 * node.data["size"]).attr('y', pos.y - 0.5 * node.data["size"]);
      });
  }
  
  addNodesToGraph (root_user, followers, graph) {
    const getDataFromPerson = (person) => {
      return {url : person["avatar_url"] || this.defaultURL, size: person["size"] || this.defaultIconSize}
    }

    if (!graph.getNode(root_user["login"])){
        graph.addNode(root_user["login"], getDataFromPerson(root_user))
    }

    for (const person of followers) {
      if (!graph.getNode(person["login"])) {
        graph.addNode(person["login"], getDataFromPerson(person))
      }
//      graph.addLink(root_user["login"], person["login"]);
          if (person["followers"] !== undefined) {
            this.addNodesToGraph(person, person["followers"], graph)
          }
    }
  }

  addLinkstoGraph(root_user, followers, graph) {
     for (const person of followers) {
        graph.addLink(root_user["login"], person["login"]);
        if (person["followers"] !== undefined) {
            this.addLinkstoGraph(person, person["followers"], graph)
        }
     }
  }

  render (root_user, followers) {
    const graph = Viva.Graph.graph()
    this.addNodesToGraph(root_user, followers, graph)
    const layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength : followers && followers.length * 2 || 200,
      springCoeff : 0.00001,
      dragCoeff : 0.002,
      gravity : -12.5
    });
//    graph.forEachNode(function (node) {
//      // layout here is instance of Viva.Graph.Layout.forceDirected or Viva.Graph.Layout.constant:
//      var position = layout.getNodePosition(node.id);
//      position.x += -0.5 * node.data["size"];
//      position.y += -0.5 * node.data["size"];
//    });

    this.addLinkstoGraph(root_user, followers, graph)

    const renderer = Viva.Graph.View.renderer(graph, {
      container: document.querySelector(".graph-container"),
      layout: layout,
      graphics : this.graphics
    });
    renderer.run()
  }
}