import { Card, Container, Grid, Text } from '@nextui-org/react';
import { BasicItem } from '../../db/items';
import PriceChart from '../PriceChart/PriceChart';
import PriceChartProvider from '../PriceChart/PriceChartProvider';
import TimeIntervalButtonGroup from '../TimeIntervalButtonGroup/TimeIntervalButtonGroup';

const GrandExchangeCard = ({ item }: { item: BasicItem }) => (
  <Card css={{ padding: '3rem', paddingTop: '1rem' }}>
    <Card.Header>
      <Grid>
        <Text h2>Grand Exchange</Text>
        <Text size="$lg" color="$gray800">
          Pricing information for {item.name}
        </Text>
      </Grid>
    </Card.Header>
    <PriceChartProvider>
      <Container display="flex" alignItems="center" justify="flex-end">
        <TimeIntervalButtonGroup />
      </Container>
      <PriceChart id={item.id} />
    </PriceChartProvider>
  </Card>
);

export default GrandExchangeCard;
