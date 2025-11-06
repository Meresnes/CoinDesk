import {Flex, IconButton, Input, Box} from "@chakra-ui/react";
import {LuSearch, LuX} from "react-icons/lu";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
    searchValue: string,
    onSearchChange: (value: string) => void,
    placeholder?: string
}

export function SearchBar({searchValue, onSearchChange, placeholder = "Search cryptocurrencies..."}: SearchBarProps) {
    return (
        <Box className={styles.searchContainer}>
            <Flex className={styles.searchFlex}>
                <Box className={styles.searchIcon}>
                    <LuSearch size={20} />
                </Box>
                <Input
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={styles.searchInput}
                />
                {searchValue && (
                    <IconButton
                        aria-label={"Clear search"}
                        variant={"ghost"}
                        size={"sm"}
                        className={styles.clearButton}
                        onClick={() => onSearchChange("")}
                    >
                        <LuX size={16} />
                    </IconButton>
                )}
            </Flex>
        </Box>
    );
}

