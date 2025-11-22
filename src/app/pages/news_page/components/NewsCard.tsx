import {Box, Flex, Heading, Text, HStack, VStack, Badge} from "@chakra-ui/react";
import * as React from "react";
import type {Article} from "../../../types/News";
import styles from "./NewsCard.module.scss";

interface NewsCardProps {
    article: Article,
    onClick?: (url: string) => void
}

export const NewsCard = React.memo(({article, onClick}: NewsCardProps) => {
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setImageError(false);
    }, [article.IMAGE_URL]);

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return "Just now";
        }
        if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        }
        if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        }
        if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
        });
    };

    const handleClick = () => {
        if (onClick && article.URL) {
            onClick(article.URL);
        } else if (article.URL) {
            window.open(article.URL, "_blank", "noopener,noreferrer");
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <Box className={styles.card} onClick={handleClick}>
            {article.IMAGE_URL && (
                <Box className={styles.imageContainer}>
                    {!imageError ? (
                        <img
                            src={article.IMAGE_URL}
                            alt={article.TITLE}
                            className={styles.image}
                            onError={handleImageError}
                            loading={"lazy"}
                        />
                    ) : (
                        <Box className={styles.imageFallback}>
                            <Text>No Image</Text>
                        </Box>
                    )}
                </Box>
            )}
            <VStack align={"stretch"} gap={3} className={styles.content}>
                <VStack align={"stretch"} gap={2}>
                    <Heading size={"md"} className={styles.title}>
                        {article.TITLE}
                    </Heading>
                    {article.SUBTITLE && (
                        <Text className={styles.subtitle}>
                            {article.SUBTITLE}
                        </Text>
                    )}
                </VStack>

                <Flex justifyContent={"space-between"} alignItems={"center"} className={styles.footer}>
                    <HStack gap={3} className={styles.meta}>
                        {article.AUTHORS && (
                            <Text className={styles.author}>
                                {article.AUTHORS}
                            </Text>
                        )}
                        <Text className={styles.date}>
                            {formatDate(article.PUBLISHED_ON)}
                        </Text>
                    </HStack>

                    <HStack gap={2}>
                        {article.UPVOTES > 0 && (
                            <Badge colorPalette={"green"} variant={"subtle"} size={"sm"}>
                                ↑ {article.UPVOTES}
                            </Badge>
                        )}
                        {article.DOWNVOTES > 0 && (
                            <Badge colorPalette={"red"} variant={"subtle"} size={"sm"}>
                                ↓ {article.DOWNVOTES}
                            </Badge>
                        )}
                    </HStack>
                </Flex>
            </VStack>
        </Box>
    );
});

// NewsCard.displayName = "NewsCard";

