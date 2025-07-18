import { currency } from "../../../../../services/utilities";

const get = {
  totalAmount: (cluster) => {
    return cluster.reduce((acc, item) => {
      const itemTotal = item.deals.reduce((dealAcc, deal) => {
        const dealTotal = deal.sendouts ? deal.sendouts.up || 0 : 0;
        return dealAcc + dealTotal;
      }, 0);
      return acc + itemTotal;
    }, 0);
  },
  description: (vendor, cluster) => {
    const maximum = vendor?.soa?.amount;
    const current = get.totalAmount(cluster);

    if (current < maximum) {
      return (
        <h5>
          You need to create transactions worth
          <span className="text-success"> {currency.format(maximum)} </span>
          to generate the SOA. Current total:
          <span className="text-primary">{currency.format(current)}</span>.
        </h5>
      );
    }

    if (current > maximum) {
      return (
        <h5>
          Exceeded{" "}
          <span className="text-success">{currency.format(maximum)} </span>{" "}
          maximum total. Please adjust your transactions. Current total:
          <span className="text-danger">{currency.format(current)}</span>.
        </h5>
      );
    }
    return (
      <h5>
        Ready to generate SOA! Current total:{" "}
        <span className="text-success">{currency.format(current)}</span>.
      </h5>
    );
  },
};

export default get;
