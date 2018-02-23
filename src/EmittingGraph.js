const Graph = require('graphlib').Graph;
const EventEmitter = require('events');

class EmittingGraph extends EventEmitter {
  constructor(name, prebuiltGraph) {
    super();
    const graph = prebuiltGraph || new Graph();
    const context = this;
    const graphFunctions = Object.keys(Object.getPrototypeOf(graph))
      .filter((prop) => graph[prop] instanceof Function);

    graphFunctions.forEach(functionName => {
      let graphFn = graph[functionName].bind(graph);

      if(functionName.startsWith('set') || functionName.startsWith('remove')) {
        let oldFn = graphFn;

        graphFn = function() {
          const result = oldFn.apply(graph, arguments);
          context.emit(functionName, ...arguments);
          return result;
        }
      }
      context[functionName] = graphFn;
    });
    graph.setGraph(name);
  }
  getNode(name) {
    return {
      name,
      value: this.node(name)
    }
  }
  getNodes() {
    return this.nodes().map((name) => this.getNode(name));
  }
  findNodes(filterFn) {
    return this.getNodes().filter(filterFn);
  }
  getEdge(fromNode, toNode) {
    return {
      fromNode,
      toNode,
      value: this.edge(fromNode, toNode)
    }
  }
  getEdges() {
    return this.edges().map(({v, w}) => this.getEdge(v, w))
  }
  findEdges(filterFn) {
    return this.getEdges().filter(filterFn);
  }
}

module.exports = EmittingGraph;