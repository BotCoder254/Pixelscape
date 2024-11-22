import {
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
  useColorModeValue
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';

export default function SearchBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filters,
  onFilterChange,
  isLoading
}) {
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box mb={6}>
      <HStack spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            bg={bgColor}
          />
        </InputGroup>

        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          width="200px"
          bg={bgColor}
        >
          <option value="newest">Newest</option>
          <option value="votes">Most Votes</option>
          <option value="answers">Most Answers</option>
          <option value="unanswered">Unanswered</option>
        </Select>

        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            rightIcon={<FiChevronDown />}
            leftIcon={<FiFilter />}
            bg={bgColor}
          >
            Filters
          </MenuButton>
          <MenuList>
            <MenuOptionGroup title="Tags" type="checkbox">
              {filters.tags.map(tag => (
                <MenuItemOption
                  key={tag}
                  value={tag}
                  isChecked={filters.selectedTags.includes(tag)}
                  onChange={() => onFilterChange('tags', tag)}
                >
                  {tag}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
            <MenuOptionGroup title="Time" type="radio">
              <MenuItemOption value="all">All Time</MenuItemOption>
              <MenuItemOption value="today">Today</MenuItemOption>
              <MenuItemOption value="week">This Week</MenuItemOption>
              <MenuItemOption value="month">This Month</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
} 