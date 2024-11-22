import { HStack, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';

export default function QuestionTags({ tags, onRemoveTag, isEditable = false }) {
  return (
    <HStack spacing={2} wrap="wrap">
      {tags.map((tag, index) => (
        <Tag
          key={index}
          size="md"
          borderRadius="full"
          variant="solid"
          colorScheme="blue"
          className="hover-transform"
        >
          <TagLabel>{tag}</TagLabel>
          {isEditable && (
            <TagCloseButton onClick={() => onRemoveTag(tag)} />
          )}
        </Tag>
      ))}
    </HStack>
  );
} 