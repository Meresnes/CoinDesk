import {Flex, IconButton, Input} from "@chakra-ui/react";
import {LuSearch, LuX} from "react-icons/lu";

interface SearchBarProps {
    searchValue: string,
    onSearchChange: (value: string) => void,
    placeholder?: string
}

export function SearchBar({searchValue, onSearchChange, placeholder = "Search asset..."}: SearchBarProps) {
    return (
        <Flex width={"full"} position={"relative"} alignItems={"center"}>
            <LuSearch style={{position: "absolute", left: "0.75rem", zIndex: 1, color: "gray.300"}} />
            <Input
                placeholder={placeholder}
                pl={"2.5rem"}
                pr={searchValue ? "2.5rem" : "1rem"}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchValue && (
                <IconButton
                    aria-label={"Clear search"}
                    variant={"ghost"}
                    size={"sm"}
                    position={"absolute"}
                    right={"0.5rem"}
                    zIndex={1}
                    onClick={() => onSearchChange("")}
                >
                    <LuX />
                </IconButton>
            )}
        </Flex>
    );
}

