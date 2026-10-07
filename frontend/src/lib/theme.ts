import type { ThemeConfig } from 'antd';

export const customTheme: ThemeConfig = {
  token: {
    colorPrimary: '#2563eb', // Modern Blue
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: 14,
    colorBgBase: '#ffffff',
    colorTextBase: '#0f172a',
    controlHeight: 38
  },
  components: {
    Button: {
      controlHeight: 38,
      borderRadius: 8,
      fontWeight: 500
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8fafc',
      headerColor: '#475569',
      rowHoverBg: '#f1f5f9'
    },
    Card: {
      borderRadiusLG: 12
    },
    Modal: {
      borderRadiusLG: 16
    },
    Drawer: {
      borderRadiusLG: 16
    },
    Tag: {
      borderRadiusSM: 6
    }
  }
};
