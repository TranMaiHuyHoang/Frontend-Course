'use client';

import React, { ReactNode } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import { customTheme } from '@/lib/theme';

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={customTheme}>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
