import React, { ReactElement, useState } from 'react';
import { AntDesignOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Space } from 'antd';
import { createStyles } from 'antd-style';
import { useNavigate } from 'react-router-dom';
import { sendData } from '../../utilities/sendData';


const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

type GradiendButtonProps = {
  points?:any;
  text: string;
  action?: (...args: any[]) => any;
}

export type Pair<T> = [T,T]





const GradientButton: React.FC<GradiendButtonProps> = ({points, text, action}: GradiendButtonProps) => {
  const { styles } = useStyle();
  const navigate = useNavigate();


  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Space>
        <Button onClick={action} type="primary" size="large" icon={<AntDesignOutlined />}>
          {text}
        </Button>
      </Space>
    </ConfigProvider>
  );
};

export default GradientButton;