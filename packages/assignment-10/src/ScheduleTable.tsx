import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { DAY_LABELS, 분 } from "./constants";
import { Schedule } from "./types";
import { fill2, parseHnM } from "./utils";

interface Props {
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string, time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string, time: number }) => void;
}

const TIMES = [
  ...Array(18)
    .fill(0)
    .map((v, k) => v + k * 30 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

  ...Array(6)
    .fill(18 * 30 * 분)
    .map((v, k) => v + k * 55 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;

const ScheduleTable = ({ schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {

  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };

  return (
    <Box position="relative">
      <Grid
        templateColumns={`20% repeat(${DAY_LABELS.length}, 1fr)`}
        templateRows={`40px repeat(${TIMES.length}, 30px)`}
        bg="white"
        fontSize="sm"
        textAlign="center"
        border="1px solid"
        borderColor="gray.300"
      >
        <GridItem borderColor="gray.300" bg="gray.100">
          <Flex justifyContent="center" alignItems="center" h="full" w="full">
            <Text fontWeight="bold">교시</Text>
          </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
          <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
            <Flex justifyContent="center" alignItems="center" h="full">
              <Text fontWeight="bold">{day}</Text>
            </Flex>
          </GridItem>
        ))}
        {TIMES.map((time, rowIndex) => (
          <>
            <GridItem
              key={`${rowIndex + 1}-1`}
              borderTop="1px solid"
              borderColor="gray.300"
              bg={rowIndex > 17 ? 'gray.200' : 'gray.100'}
            >
              <Flex justifyContent="center" alignItems="center" h="full">
                <Text fontSize="xs">{fill2(rowIndex + 1)} ({time})</Text>
              </Flex>
            </GridItem>
            {DAY_LABELS.map((day, columnIndex) => (
              <GridItem
                key={`${rowIndex + 1}-${columnIndex + 2}`}
                borderWidth="1px 0 0 1px"
                borderColor="gray.300"
                bg={rowIndex > 17 ? 'gray.100' : 'white'}
                cursor="pointer"
                _hover={{ bg: 'yellow.100' }}
                onClick={() => onScheduleTimeClick?.({ day, time: rowIndex + 1 })}
              />
            ))}
          </>
        ))}
      </Grid>

      {schedules.map(({ day, range, room, lecture }) => {
        const leftIndex = DAY_LABELS.indexOf(day as typeof DAY_LABELS[number]);
        const topIndex = range[0] - 1;
        const size = range.length

        return (
          <Popover key={`${day}-${range[0]}`}>
            <PopoverTrigger>
              <Box
                position="absolute"
                left={`calc(${20 + (leftIndex * 13.333)}% + 1px)`}
                top={`${40 + topIndex * 30 + 2}px`}
                width="calc(13.333% - 1px)"
                height={size * 30 - 1 + "px"}
                bg={getColor(lecture.id)}
                p={1}
                boxSizing="border-box"
                cursor="pointer"
              >
                <Text fontSize="sm" fontWeight="bold">{lecture.title}</Text>
                <Text fontSize="xs">{room}</Text>
              </Box>
            </PopoverTrigger>
            <PopoverContent onClick={event => event.stopPropagation()}>
              <PopoverArrow/>
              <PopoverCloseButton/>
              <PopoverBody>
                <Text>강의를 삭제하시겠습니까?</Text>
                <Button colorScheme="red" size="xs" onClick={() => onDeleteButtonClick?.({ day, time: range[0] })}>
                  삭제
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        );
      })}
    </Box>
  );
};

export default ScheduleTable;
