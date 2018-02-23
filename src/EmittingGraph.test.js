const EmittingGraph = require('./EmittingGraph');
const Graph = require('graphlib').Graph;

function createTestGraph(nodeCount) {
  const testGraph = new EmittingGraph('testGraph');
  //create nodes
  for(let i = 0; i < nodeCount; i++) {
    testGraph.setNode(`node-${i}`, `node-data-${i}`);
  }
  //connect all nodes to eachother
  testGraph.nodes().forEach((fromNode, index) => {
    let toNodes = testGraph.nodes();
    toNodes.splice(index, 1);
    toNodes.forEach((toNode) => {
      testGraph.setEdge(fromNode, toNode, `${fromNode} -> ${toNode}`);
    })
  });

  return testGraph;
}

describe('EmittingGraph', () => {
  let graph;

  beforeEach(() => {
    graph = createTestGraph(3);
  });

  it('sets graph name to the passed value', () => {
    graph = new EmittingGraph('graphName');
    expect(graph.graph()).toBe('graphName');
  });

  it('sets the graph to a preconstructed graph when passed', () => {
    const preconstructedGraph = new Graph();
    preconstructedGraph.setNode('test0', 'nodeValue0');
    preconstructedGraph.setNode('test1', 'nodeValue1');
    preconstructedGraph.setEdge('test0', 'test1', 'edgeValue');

    graph = new EmittingGraph('graph', preconstructedGraph);
    expect(graph.nodes()).toEqual([ 'test0', 'test1' ]);
    expect(graph.edges()).toEqual([{ v:'test0', w:'test1' }]);
  });

  it('emits when set and remove functions are called', () => {
    const setNodeListenerMock = jest.fn();
    const removeNodeListenerMock = jest.fn();
    const setEdgeListenerMock = jest.fn();
    const removeEdgeListenerMock = jest.fn();

    graph.on('setNode', setNodeListenerMock);
    graph.on('removeNode', removeNodeListenerMock);
    graph.on('setEdge', setEdgeListenerMock);
    graph.on('removeEdge', removeEdgeListenerMock);

    graph.setNode('test', 'value');
    expect(setNodeListenerMock).toBeCalledWith('test', 'value');

    graph.removeNode('test');
    expect(removeNodeListenerMock).toBeCalledWith('test');

    graph.removeEdge('node-0', 'node-1');
    expect(removeEdgeListenerMock).toBeCalledWith('node-0', 'node-1');

    graph.setEdge('node-0', 'node-1', 'testValue');
    expect(setEdgeListenerMock).toBeCalledWith('node-0', 'node-1', 'testValue');
  });

  it('provides node utility functions', () => {
    let node = graph.getNode('node-0');
    let nodes = graph.getNodes();
    let oddNodes = graph.findNodes(() => {});
  });

  it('provides edge utility functions', () => {

  });
});