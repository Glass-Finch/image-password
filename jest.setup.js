const { default: React } = require('react')
require('@testing-library/jest-dom')

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => React.createElement('img', props),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
    span: ({ children, ...props }) => React.createElement('span', props, children),
    button: ({ children, ...props }) => React.createElement('button', props, children),
  },
}))