import { Box, keyframes } from '@chakra-ui/react';

const liquidAnimation = keyframes`
  0% {
    transform: translate(-50%, -75%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -75%) rotate(360deg);
  }
`;

const waveAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20%);
  }
  100% {
    transform: translateY(0);
  }
`;

export default function LiquidLoader({ size = "100px", color = "blue.500" }) {
  return (
    <Box
      position="relative"
      width={size}
      height={size}
      margin="auto"
      sx={{
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background: color,
          borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
          animation: `${liquidAnimation} 2s linear infinite`,
          opacity: 0.7,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background: color,
          borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
          animation: `${liquidAnimation} 2s linear infinite, ${waveAnimation} 1s ease-in-out infinite`,
          opacity: 0.5,
        }
      }}
    />
  );
} 