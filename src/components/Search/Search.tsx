import { useComboBox } from 'downshift';
import { useState } from 'react';

const books = [
  { author: 'Harper Lee', title: 'To Kill a Mockingbird' },
  { author: 'Lev Tolstoy', title: 'War and Peace' },
  { author: 'Fyodor Dostoyevsy', title: 'The Idiot' },
  { author: 'Oscar Wilde', title: 'A Picture of Dorian Gray' },
  { author: 'George Orwell', title: '1984' },
  { author: 'Jane Austen', title: 'Pride and Prejudice' },
  { author: 'Marcus Aurelius', title: 'Meditations' },
  { author: 'Fyodor Dostoevsky', title: 'The Brothers Karamazov' },
  { author: 'Lev Tolstoy', title: 'Anna Karenina' },
  { author: 'Fyodor Dostoevsky', title: 'Crime and Punishment' },
];
function getBooksFilter(inputValue) {
  return function booksFilter(book) {
    return (
      !inputValue || book.title.toLowerCase().includes(inputValue) || book.author.toLowerCase().includes(inputValue)
    );
  };
}

const Search = () => {
  const [items, setItems] = useState(books);
  const {
    inputValue,
    selectedItem,
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    getInputProps,
    getComboboxProps,
  } = useComboBox({
    items,
    onInputValueChange({ inputValue }) {
      setItems(books.filter(getBooksFilter(inputValue)));
    },
    itemToString(item) {
      return item ? item.title : '';
    },
  });

  return (
    <Box>
      <Box className="w-72 flex flex-col gap-1">
        <FormLabel classeName="w-fit" {...getLabelProps()}>
          Choose your favorite book:
        </FormLabel>
        <Box className="flex shadow-sm bg-white gap-0.5" {...getComboboxProps()}>
          <Input placeholder="Best book ever" className="w-full p-1.5" {...getInputProps({ refKey: 'inputRef' })} />
          <IconButton className="px-2" color="secondary" {...getToggleButtonProps()}>
            {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      <List
        className={cx(!isOpen && 'hidden', '!absolute bg-white w-72 shadow-md max-h-80 overflow-scroll')}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => {
            return (
              <ListItem
                className={cx(
                  highlightedIndex === index && 'bg-blue-300',
                  selectedItem === item && 'font-bold',
                  'py-2 px-3 shadow-sm',
                )}
                key={`${item.title}-${index}`}
                {...getItemProps({
                  item,
                  index,
                })}
              >
                <ListItemText primary={item.title} secondary={item.author} />
              </ListItem>
            );
          })}
      </List>
    </Box>
  );
};

export default Search;
