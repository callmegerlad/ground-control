import { useEffect, useMemo, useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumb, Button, Drawer, Layout, Menu, Space, Switch, Typography } from 'antd'
import Icon from '../components/Icon'


const THEME_STORAGE_KEY = 'ground-control-theme'
const { Sider, Content } = Layout
const { Text, Title } = Typography

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
}

const navItems = [
  { key: '/cafes', label: 'Cafes', icon: 'Store' },
  { key: '/employees', label: 'Employees', icon: 'IdCard' },
]

const menuItems = navItems.map((item) => ({
  key: item.key,
  icon: <Icon name={item.icon} size={18} />,
  label: item.label,
}))

function useActivePath() {
  const location = useLocation()

  return useMemo(() => {
    if (location.pathname.startsWith('/employees')) {
      return '/employees'
    }
    return '/cafes'
  }, [location.pathname])
}

function useBreadcrumbItems() {
  const location = useLocation()

  return useMemo(() => {
    const path = location.pathname

    const routeMap = [
      { path: '/cafes', label: 'Cafes' },
      { path: '/cafes/new', label: 'Create Cafe' },
      { path: '/employees', label: 'Employees' },
      { path: '/employees/new', label: 'Create Employee' },
    ]

    if (path.startsWith('/cafes/edit/')) {
      routeMap.splice(1, 0, { path, label: 'Edit Cafe' })
    }

    if (path.startsWith('/employees/edit/')) {
      routeMap.splice(3, 0, { path, label: 'Edit Employee' })
    }

    const crumbs = [{ title: <span className="text-on-surface-variant!">Home</span>, href: '/' }]

    if (path.startsWith('/cafes')) {
      crumbs.push({
        title: routeMap.find((item) => item.path === '/cafes')?.label ?? 'Cafes',
        href: '/cafes',
      })

      if (path === '/cafes/new') {
        crumbs.push({ title: 'Create Cafe' })
      } else if (path.startsWith('/cafes/edit/')) {
        crumbs.push({ title: 'Edit Cafe' })
      }
    }

    if (path.startsWith('/employees')) {
      crumbs.push({
        title: routeMap.find((item) => item.path === '/employees')?.label ?? 'Employees',
        href: '/employees',
      })

      if (path === '/employees/new') {
        crumbs.push({ title: 'Create Employee' })
      } else if (path.startsWith('/employees/edit/')) {
        crumbs.push({ title: 'Edit Employee' })
      }
    }

    return crumbs
  }, [location.pathname])
}

function ThemeToggleLabel({ darkMode, onThemeToggle }) {
  return (
    <Space
      align="center"
      className="w-full justify-between"
    >
      Theme
      <Switch
        checked={darkMode}
        onChange={onThemeToggle}
        onClick={(_, event) => event?.stopPropagation()}
      />
    </Space>
  )
}

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const activePath = useActivePath()
  const breadcrumbItems = useBreadcrumbItems()
  const [isMobile, setIsMobile] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(max-width: 1024px)')

    const updateIsMobile = (event) => {
      setIsMobile(event.matches)
    }

    setIsMobile(mediaQuery.matches)

    mediaQuery.addEventListener('change', updateIsMobile)

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    window.localStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    const titleMap = [
      { match: /^\/cafes$/, title: 'Cafe Network' },
      { match: /^\/cafes\/new$/, title: 'Create Cafe' },
      { match: /^\/cafes\/edit\//, title: 'Edit Cafe' },
      { match: /^\/employees$/, title: 'Employee Directory' },
      { match: /^\/employees\/new$/, title: 'Create Employee' },
      { match: /^\/employees\/edit\//, title: 'Edit Employee' },
    ]

    const activeTitle = titleMap.find((item) => item.match.test(location.pathname))?.title
      ?? 'Cafe Management'

    document.title = `Ground Control | ${activeTitle}`
  }, [location.pathname])

  const onThemeToggle = (checked) => {
    setDarkMode(checked)
  }

  const onSiderToggle = () => {
    setCollapsed((previous) => !previous)
  }

  const siderMenuItems = [
    {
      type: 'group',
      label: 'Navigation',
      children: menuItems,
    },
    {
      type: 'divider',
    },
    {
      type: 'group',
      label: 'System',
      children: [
        {
          key: 'theme-toggle',
          title: darkMode ? 'Switch to light mode' : 'Switch to dark mode',
          label: (
            <ThemeToggleLabel
              darkMode={darkMode}
              onThemeToggle={onThemeToggle}
            />
          ),
          icon: <Icon name={darkMode ? 'SunMedium' : 'MoonStar'} size={16} />,
        },
      ],
    },
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col py-6">
      <div className="mb-10 flex items-center justify-between gap-2 px-5">
        <button
          type="button"
          onClick={() => navigate('/')}
          className={[
            'flex w-full cursor-pointer items-center rounded-xl bg-transparent text-left gap-3',
            collapsed ? 'justify-start' : null,
          ].join(' ')}
          aria-label="Go to home"
        >
          <img
            src="/static/logo.png"
            alt="Ground Control Logo"
            className="h-12 w-12 rounded-xl shadow-ambient object-cover"
          />
          <div
            aria-hidden={collapsed}
            className={[
              'overflow-hidden transition-all duration-200',
              collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100',
            ].join(' ')}
          >
            <Title level={4} className="mb-0! whitespace-nowrap text-primary! text-2xl!">
              Ground Control
            </Title>
            <Text className="text-xs! whitespace-nowrap uppercase! tracking-[0.12em]! text-on-surface-variant! font-semibold">
              Cafe management
            </Text>
          </div>
        </button>

        {isMobile ? (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onSiderToggle}
            className="text-on-surface-variant!"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          />
        ) : null}
      </div>

      <Menu
        mode="inline"
        theme={darkMode ? 'dark' : 'light'}
        items={siderMenuItems}
        selectedKeys={[activePath]}
        onClick={({ key }) => {
          if (key === 'theme-toggle') {
            setDarkMode((previous) => !previous)
            return
          }
          if (String(key).startsWith('/')) {
            navigate(key)
            if (isMobile) {
              setCollapsed(true)
            }
          }
        }}
        className="ground-control-sider-menu border-none! bg-transparent!"
      />

      <div className="mt-auto px-5 pt-6">
        <Button
          type="text"
          block
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onSiderToggle}
          className="justify-start text-on-surface-variant!"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        />
      </div>
    </div>
  )

  return (
    <Layout className="min-h-screen h-screen bg-surface-container-low!">
      {isMobile ? (
        <Drawer
          open={!collapsed}
          onClose={() => setCollapsed(true)}
          placement="left"
          width="100vw"
          closable={false}
          mask
          className="ground-control-mobile-drawer"
          styles={{
            body: {
              padding: 0,
              background: 'var(--surface-container-highest)',
            },
            content: {
              background: 'var(--surface-container-highest)',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Sider
          width={264}
          className="bg-surface-container-highest! shadow-none! rounded-r-2xl! overflow-hidden!"
          style={siderStyle}
          collapsible
          trigger={null}
          collapsedWidth={90}
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
        >
          {sidebarContent}
        </Sider>
      )}

      <Layout>
        <Content className="bg-surface-container-low p-4 sm:p-6 lg:p-12">
          <div className="my-4 flex items-center justify-between lg:hidden">
            <Text className="text-sm! uppercase tracking-[0.08em] text-on-surface-variant!">Ground Control</Text>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={onSiderToggle}
              className="text-on-surface-variant!"
              aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
            />
          </div>
          <div className="mx-auto max-w-7xl space-y-4">
            <Breadcrumb items={breadcrumbItems} />
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
