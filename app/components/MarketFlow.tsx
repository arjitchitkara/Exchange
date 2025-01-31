import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWindowDimensions } from '../hooks/useWindowDimensions';

interface Market {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
}

interface MarketFlowProps {
  markets: Market[];
}

const nodeTypes = {
  market: ({ data }: { data: Market }) => (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-[#1C1D21] border border-gray-800">
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-lg font-bold text-white">{data.symbol.replace('USDT', '')}</div>
          <div className="text-gray-400 text-sm">
            ${Number(data.lastPrice).toLocaleString()}
          </div>
        </div>
      </div>
      <div className={`text-sm mt-2 ${
        Number(data.priceChangePercent) > 0 ? 'text-green-500' : 'text-red-500'
      }`}>
        {Number(data.priceChangePercent) > 0 ? '+' : ''}
        {Number(data.priceChangePercent).toFixed(2)}%
      </div>
    </div>
  ),
};

export function MarketFlow({ markets }: MarketFlowProps) {
  const { width, height, isMobile } = useWindowDimensions();
  
  const initialNodes: Node[] = useMemo(() => 
    markets.map((market, index) => ({
      id: market.symbol,
      type: 'market',
      data: market,
      position: {
        x: (index % 3) * 300 + 50,
        y: Math.floor(index / 3) * 150 + 50,
      },
    })), [markets]);

  const initialEdges: Edge[] = useMemo(() => 
    markets.slice(0, -1).map((market, index) => ({
      id: `e${market.symbol}-${markets[index + 1].symbol}`,
      source: market.symbol,
      target: markets[index + 1].symbol,
      animated: true,
      style: { stroke: '#2C2D33' },
    })), [markets]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(() => {
    const nodeWidth = isMobile ? 200 : 300;
    const nodeHeight = 100;
    const nodesPerRow = isMobile ? 1 : Math.floor(width / (nodeWidth + 50));
    
    setNodes((nds) =>
      nds.map((node, index) => ({
        ...node,
        position: {
          x: (index % nodesPerRow) * (nodeWidth + 50) + 50,
          y: Math.floor(index / nodesPerRow) * (nodeHeight + 50) + 50,
        },
      }))
    );
  }, [setNodes, width, isMobile]);

  return (
    <div style={{ width: '100%', height: height - 100 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel position="top-right">
          <button
            onClick={onLayout}
            className="px-4 py-2 rounded-md bg-[#2C2D33] text-white hover:bg-[#3C3D43] transition-colors"
          >
            Reset Layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
} 