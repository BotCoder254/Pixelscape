import {
  Box,
  HStack,
  IconButton,
  Tooltip,
  Textarea,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { Icons, MarkdownToolbar } from './Icons';

export default function MarkdownEditor({ value, onChange, placeholder, minH = "200px" }) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const insertText = (template) => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selectedText = text.substring(start, end);

    let newText = template;
    if (selectedText) {
      newText = template.replace('text', selectedText);
    }

    onChange(before + newText + after);
    textarea.focus();
  };

  return (
    <Box borderWidth={1} borderRadius="md" overflow="hidden">
      <HStack 
        spacing={1} 
        p={2} 
        borderBottomWidth={1}
        overflowX="auto"
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        {MarkdownToolbar.map((item) => (
          <Tooltip 
            key={item.label} 
            label={item.label}
            placement="top"
            hasArrow
          >
            <IconButton
              icon={Icons[item.icon]({ boxSize: 4 })}
              size="sm"
              variant="ghost"
              onClick={() => insertText(item.text)}
              aria-label={item.label}
            />
          </Tooltip>
        ))}
      </HStack>

      <Tabs>
        <TabList>
          <Tab>Write</Tab>
          <Tab>Preview</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              minH={minH}
              p={4}
              border="none"
              _focus={{ border: 'none', boxShadow: 'none' }}
              resize="vertical"
            />
          </TabPanel>
          <TabPanel>
            <Box 
              minH={minH}
              p={4}
              className="markdown-preview"
            >
              <ReactMarkdown>{value || '*No content to preview*'}</ReactMarkdown>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
} 