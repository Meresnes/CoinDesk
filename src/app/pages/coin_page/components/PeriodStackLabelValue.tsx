import {FormatNumber, HStack, SkeletonText, Stack, Text} from "@chakra-ui/react";
import {SortPeriodType} from "../../../types/Sort";

type IProps = {
    label: string,
    currentSortPeriod: SortPeriodType
    priceValue?: number,
    priceTextColor?: string,
    isLoading: boolean,
};

export function PeriodStackLabelValue (props: IProps) {

    const {isLoading, priceTextColor, priceValue, label, currentSortPeriod} = props;

    return (
        <>
            {!isLoading && priceValue ? (
                <Stack gap="1">
                    <Text color="fg.muted" textStyle="sm">
                        {currentSortPeriod + " " + label}
                    </Text>
                    <Text fontWeight="bold" textStyle={"xs"} color={priceTextColor}>
                        <FormatNumber
                            value={priceValue}
                            notation={"compact"}
                            minimumFractionDigits={2}
                            maximumFractionDigits={3}
                            style="currency"
                            currency="USD"
                        />
                    </Text>
                </Stack>
            ) : (
                <div>
                    <Stack maxW="xs">
                        <HStack width="100px">
                            <SkeletonText noOfLines={3} />
                        </HStack>
                    </Stack>
                </div>
            )}
        </>
    );
}