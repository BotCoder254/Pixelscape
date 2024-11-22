import { Icon } from '@chakra-ui/react';
import { 
  FaGoogle, 
  FaGithub, 
  FaTwitter, 
  FaFacebook,
  FaMarkdown,
  FaTag,
  FaCode,
  FaLink,
  FaImage,
  FaBold,
  FaItalic,
  FaListUl,
  FaListOl,
  FaQuoteRight
} from 'react-icons/fa';
import { 
  BiCodeBlock, 
  BiHeading, 
  BiTable 
} from 'react-icons/bi';

export const Icons = {
  Google: (props) => <Icon as={FaGoogle} {...props} />,
  Github: (props) => <Icon as={FaGithub} {...props} />,
  Twitter: (props) => <Icon as={FaTwitter} {...props} />,
  Facebook: (props) => <Icon as={FaFacebook} {...props} />,
  Markdown: (props) => <Icon as={FaMarkdown} {...props} />,
  Tag: (props) => <Icon as={FaTag} {...props} />,
  Code: (props) => <Icon as={FaCode} {...props} />,
  CodeBlock: (props) => <Icon as={BiCodeBlock} {...props} />,
  Link: (props) => <Icon as={FaLink} {...props} />,
  Image: (props) => <Icon as={FaImage} {...props} />,
  Bold: (props) => <Icon as={FaBold} {...props} />,
  Italic: (props) => <Icon as={FaItalic} {...props} />,
  Heading: (props) => <Icon as={BiHeading} {...props} />,
  UnorderedList: (props) => <Icon as={FaListUl} {...props} />,
  OrderedList: (props) => <Icon as={FaListOl} {...props} />,
  Quote: (props) => <Icon as={FaQuoteRight} {...props} />,
  Table: (props) => <Icon as={BiTable} {...props} />,
};

export const MarkdownToolbar = [
  { icon: 'Bold', text: '**text**', label: 'Bold' },
  { icon: 'Italic', text: '*text*', label: 'Italic' },
  { icon: 'Heading', text: '# ', label: 'Heading' },
  { icon: 'Link', text: '[text](url)', label: 'Link' },
  { icon: 'Image', text: '![alt](url)', label: 'Image' },
  { icon: 'Code', text: '`code`', label: 'Inline Code' },
  { icon: 'CodeBlock', text: '```\ncode\n```', label: 'Code Block' },
  { icon: 'UnorderedList', text: '- ', label: 'Bullet List' },
  { icon: 'OrderedList', text: '1. ', label: 'Numbered List' },
  { icon: 'Quote', text: '> ', label: 'Quote' },
  { icon: 'Table', text: '| Header | Header |\n| --- | --- |\n| Cell | Cell |', label: 'Table' },
]; 