import { MDBBadge } from "mdbreact";
import { Select, Input } from "../customizable";

export default function SingleUpdate({
  selected,
  setSelected,
  handleUpdate,
  formSubmitted,
  data,
  _id,
  title,
  options,
  dataType,
  isBadge = false,
  isSuccess,
}) {
  return (
    <>
      {selected._id === _id && selected?.updatedKey === title ? (
        <div
          style={{ width: "17rem" }}
          className="mt-3 d-flex align-items-center"
        >
          {options ? (
            <>
              <Select
                label={"Category"}
                onChange={(value) =>
                  setSelected({ ...selected, newCategory: value })
                }
                handleCheck={() => handleUpdate("category", "newCategory")}
                handleClose={() => setSelected({})}
                formSubmitted={formSubmitted}
                soloUpdate
                whitelisted
                className="m-0 p-0"
                collections={options}
                preValue={data[title]}
                keys={"abbr"}
                values={"name"}
              />
            </>
          ) : (
            <>
              <Input
                label={title}
                selected={selected}
                onChange={(_key, value) =>
                  setSelected({ ...selected, [_key]: value })
                }
                type={dataType}
                _key={`new${title}`}
                handleCheck={() => handleUpdate(title, `new${title}`)}
                handleClose={() => setSelected({})}
                formSubmitted={formSubmitted}
                isSuccess={isSuccess}
                className=" w-100  deals-zoom-in-input-ssx"
              />
            </>
          )}
        </div>
      ) : (
        <>
          {isBadge ? (
            <MDBBadge
              color="info"
              className="mr-2 cursor-pointer"
              onClick={() => setSelected({ ...data, updatedKey: title })}
              // title={data[title]}
            >
              {data[title]}
            </MDBBadge>
          ) : (
            <label onClick={() => setSelected({ ...data, updatedKey: title })}>
              {data[title]}
            </label>
          )}
        </>
      )}
      -
    </>
  );
}
