import { useDispatch, useSelector } from "react-redux";
import { HMO } from "../../../../../../../../services/fakeDb";
import { SetCH } from "../../../../../../../../services/redux/slices/commerce/pos/services/pos";

const CardCompany = () => {
  const { cardHolder = {}, customer } = useSelector(({ pos }) => pos);
  const { collections } = useSelector(({ providers }) => providers);
  const { activePlatform = {} } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { companyId: company = {} } = branch || {};
  const { type = "" } = cardHolder;
  const dispatch = useDispatch();

  const insources =
    [...collections]?.filter(({ category }) => category === cardHolder.type) ||
    [];
  const handleSource = (_id) => {
    const _source = _id
      ? insources?.find((source) => source?._id.toString() === _id)
      : {};

    const { membership = "", contract = "", clients } = _source || {};

    dispatch(
      SetCH({
        ...cardHolder,
        company: { ...cardHolder.company, ref: clients?._id },
        tier: contract || membership,
      })
    );
  };

  if (!type) return null;

  if (type === "wls") {
    return (
      <div className="patient-form mt-2">
        <span>Company Card:</span>
        <select
          onChange={({ target }) =>
            dispatch(
              SetCH({
                ...cardHolder,
                company: { ...cardHolder.company, name: target.value },
              })
            )
          }
        >
          <option value={""}>None</option>
          {company?.hmo?.map(({ code }) => (
            <option value={code}>{HMO.getName(code)}</option>
          ))}
        </select>
      </div>
    );
  } else {
    return (
      <div className="patient-form mt-2 ">
        <span>Company Card:</span>
        <select
          disabled={!customer._id}
          onChange={({ target }) => handleSource(target.value)}
        >
          <option value="">None</option>
          {insources?.map(({ clients, _id = "" }) => {
            const { name = "", displayname = "" } = clients || {};

            return (
              <option key={_id} value={_id}>
                {displayname || name}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
};

export default CardCompany;
