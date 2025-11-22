import {Box, Container, Heading, Text, Skeleton, Center, Spinner} from "@chakra-ui/react";
import {useGetLatestArticlesQuery} from "@/app/services/newsService";
import {NewsCard} from "./components/NewsCard";
import styles from "./NewsPage.module.scss";

function NewsPage() {
    const {data, isFetching, error} = useGetLatestArticlesQuery({});

    const handleArticleClick = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <Box className={styles.pageContainer}>
            <Container className={styles.contentContainer}>
                <Box className={styles.heroSection}>
                    <Heading size={"2xl"} className={styles.heroTitle}>
                        Latest News
                    </Heading>
                    <Text className={styles.heroSubtitle}>
                        Stay updated with the latest cryptocurrency and blockchain news
                    </Text>
                </Box>
                {isFetching && !data && (
                    <Box className={styles.loadingContainer}>
                        {Array.from({length: 6}).map((_, index) => (
                            <Box key={index}>
                                <Skeleton height={"200px"} borderRadius={"md"} mb={4} />
                                <Skeleton height={"24px"} borderRadius={"md"} mb={2} />
                                <Skeleton height={"16px"} width={"80%"} borderRadius={"md"} mb={4} />
                                <Skeleton height={"16px"} width={"60%"} borderRadius={"md"} />
                            </Box>
                        ))}
                    </Box>
                )}

                {error && (
                    <Box className={styles.emptyState}>
                        <Heading size={"lg"} className={styles.emptyStateTitle}>
                            Error loading news
                        </Heading>
                        <Text className={styles.emptyStateText}>
                            Please try again later
                        </Text>
                    </Box>
                )}

                {!isFetching && data && data.Data && data.Data.length === 0 && (
                    <Box className={styles.emptyState}>
                        <Heading size={"lg"} className={styles.emptyStateTitle}>
                            No news available
                        </Heading>
                        <Text className={styles.emptyStateText}>
                            Check back later for the latest updates
                        </Text>
                    </Box>
                )}

                {!isFetching && data && data.Data && data.Data.length > 0 && (
                    <Box className={styles.newsGrid}>
                        {data.Data.map((article) => (
                            <NewsCard
                                key={article.GUID}
                                article={article}
                                onClick={handleArticleClick}
                            />
                        ))}
                    </Box>
                )}

                {isFetching && data && data.Data && data.Data.length > 0 && (
                    <Center py={8}>
                        <Spinner color={"#F0B90B"} size={"lg"} />
                    </Center>
                )}
            </Container>
        </Box>
    );
}

export default NewsPage;
