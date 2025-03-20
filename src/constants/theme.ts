import { theme } from 'antd';
import { ThemeConfig } from 'antd/lib/config-provider';

export const themeDarkConfig: ThemeConfig = {
  algorithm: [theme.darkAlgorithm],
  token: {
    colorBgElevated: '#141414',
    colorPrimaryText: '#141414',
    colorBgLayout: '#141414',
    colorPrimary: '#00b96b',
    colorBorder: 'rgba(253, 253, 253, 0.12)',
    borderRadius: 5,
    colorLink: '#ffffff',
    colorLinkHover: '#000000',
    fontFamily: 'Reddit Sans, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#141414',
    },
  },
};

export const themeLightConfig: ThemeConfig = {
  algorithm: [theme.defaultAlgorithm],
  token: {
    colorBgElevated: 'rgba(255, 255, 255, 1)', // Nền trắng hoàn toàn
    colorBgLayout: 'rgba(255, 255, 255, 1)', // Nền layout trắng
    colorPrimaryText: 'rgba(96, 0, 0, 0.9)', // Chữ chính đỏ đô tối (hơi trong suốt)
    colorPrimary: 'rgb(180, 1, 1)', // Màu chủ đạo đỏ đô (đậm)
    colorBorder: 'rgba(139, 0, 0, 0.4)', // Viền đỏ đô nhạt
    borderRadius: 5,
    colorLink: 'rgba(139, 0, 0, 1)', // Link đỏ đô
    colorLinkHover: 'rgba(107, 0, 0, 1)', // Link hover đỏ đô đậm hơn
    fontFamily: 'Reddit Sans, sans-serif',
  },
  components: {
    Layout: {
      headerBg: 'rgba(255, 255, 255, 1)', // Header trắng
    },
    Table: {
      rowExpandedBg: 'rgba(251, 234, 234, 0.8)', // Màu nền hàng mở rộng đỏ đô nhạt (mờ 20%)
    },
  },
};


export const themeBlueConfig: ThemeConfig = {
  algorithm: [theme.defaultAlgorithm],
  token: {
    colorPrimaryText: '#284973',
    // colorBgElevated: "#284973",
    colorBgLayout: '#ffffff',
    colorBorder: '#e1e1e1',
    colorPrimary: '#284973',
    borderRadius: 5,
    fontFamily: 'Reddit Sans, sans-serif',
  },
  components: {
    Menu: {
      colorBgContainer: 'rgb(13,68,138)',
      colorBgElevated: 'rgb(13,68,138)', // bg child menu when hover or active li parent
      colorText: '#ffffff',
      colorBorder: '#e1e1e1',
      colorPrimary: '#8abbff',
      controlItemBgActive: '#1a3357',
    },
    Typography: {
      colorLink: 'rgb(39, 108, 255)',
      colorLinkHover: 'rgba(0, 54, 170, 0.65)',
    },
    Drawer: {
      colorBgElevated: 'rgb(13,68,138)',
      colorText: '#ffffff',
      colorIcon: '#ffffff',
      colorIconHover: '#ffffff',
    },
    Layout: {
      headerBg: 'rgb(13,68,138)',
    },
    Table: {
      controlItemBgActive: '#c8ced2',
      controlItemBgActiveHover: '#c8ced2',
      rowExpandedBg: '#ffffff',
    },
  },
};

export const themeBrownConfig: ThemeConfig = {
  algorithm: [theme.defaultAlgorithm],
  token: {
    // colorBgElevated: "#48433d",
    colorPrimaryText: '#48433d',
    colorBgLayout: '#ffffff',
    colorBorder: '#e1e1e1',
    colorPrimary: '#48433d',
    borderRadius: 5,
    fontFamily: 'Reddit Sans, sans-serif',
  },
  components: {
    Menu: {
      colorBgContainer: '#48433d',
      colorBgElevated: '#48433d', // bg child menu when hover or active li parent
      colorText: '#ffffff',
      colorBorder: '#e1e1e1',
      colorPrimary: '#ab7632',
      controlItemBgActive: '#2e2923',
    },
    Typography: {
      colorLink: '#000000',
      colorLinkHover: '#000000',
    },
    Drawer: {
      colorBgElevated: '#48433d',
      colorText: '#ffffff',
      colorIcon: '#ffffff',
      colorIconHover: '#ffffff',
    },
    Layout: {
      headerBg: '#48433d',
    },
    Table: {
      controlItemBgActive: '#b0afab',
      controlItemBgActiveHover: '#b0afab',
      rowExpandedBg: '#ffffff',
    },
  },
};
// const handleCheckTheme = () => {
//     const key = "color"
//     const themeColor = storage.getStorage(`V-OSINT3_${key}`);
//     console.log(themeColor);

//     switch (themeColor) {
//         case "black": return themeDarkConfig;
//         case "white": return themeLightConfig;
//         case "blue": return themeDarkConfig;
//     }

//     return themeLightConfig;
// }

// export const themeConfig:ThemeConfig = handleCheckTheme();
