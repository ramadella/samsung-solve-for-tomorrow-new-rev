import React from 'react';
import WasteAreaChart from './WasteAreaChart';
import StatsComponent from '../chart/StatsComponent';
import RadialChart from './RadialChart';
import Dashboard from '../dashboard';
import WasteChart from './WasteChart';
import PieRadialChart from './PieRadialChart';
import ColorPercentages from './percentage';
import 'fontsource-roboto';

function DashboardDesign({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Dashboard activeItem="DashboardDesign" style={{ zIndex: 1, position: 'relative' }} />
      
      <main style={{
        marginLeft: '220px',
        width: 'calc(100% - 220px)',
        padding: '20px',
        zIndex: 2,
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{  flex: '1', textAlign: 'left', fontFamily: 'Roboto, sans-serif', fontWeight: '400' }}>Total Percentage</h3>
          <h3 style={{ flex: '1', textAlign: 'right', fontFamily: 'Roboto, sans-serif', fontWeight: '5o0px'}}>Data Sampah Plastik</h3>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <StatsComponent />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '100%', height: '500px', padding: '20px', background: '#f9f9f9', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            <WasteAreaChart style={{ height: '100%', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 50%', maxWidth: '48%', minHeight: '300px', background: '#f9f9f9', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <WasteChart style={{ height: '100%', width: '50%' }} />
            </div>
            <div style={{ flex: '1 1 50%', maxWidth: '48%', minHeight: '300px', background: '#f9f9f9', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <RadialChart style={{ height: '100%', width: '100%' }} />
            </div>

            {/* Second row of charts */}
            <div style={{ flex: '1 1 50%', maxWidth: '48%', minHeight: '300px', background: '#f9f9f9', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <PieRadialChart style={{ height: '100%', width: '100%' }} />
            </div>
            <div style={{ flex: '1 1 50%', maxWidth: '48%', minHeight: '300px', background: '#f9f9f9', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
              <ColorPercentages style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export default DashboardDesign;
