import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'
import { queryClient } from './lib/query-client'

ModuleRegistry.registerModules([AllCommunityModule])

const antThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    fontFamily: 'Geist, ui-sans-serif, system-ui, sans-serif',
    fontFamilyCode: 'Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    colorPrimary: '#6F4E37',
    colorInfo: '#6F4E37',
    colorSuccess: '#606C38',
    colorBgBase: '#F5F5F4',
    colorTextBase: '#1A1C1C',
    borderRadius: 4,
    wireframe: false,
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={antThemeConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  </StrictMode>,
)
