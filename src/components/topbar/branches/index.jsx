import React, { useEffect, useState } from "react";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useSelector } from "react-redux";
import { capitalize } from "../../../services/utilities";

export default function Branches() {
  const [text, setText] = useState("Branches"),
    { branches, onDuty } = useSelector(({ auth }) => auth);

  const changeBranch = (_id, index) => {
    if (_id !== onDuty._id) {
      console.log(branches[index]);
      alert("Still in progress");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setText(prev => (prev === onDuty?.name ? "Branches" : onDuty?.name));
    }, 10000);

    return () => clearInterval(timer);
  }, [onDuty]);

  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        <MDBIcon icon="code-branch" />
        &nbsp;
        <div className="d-none d-md-inline">{capitalize(text)}</div>
      </MDBDropdownToggle>
      <MDBDropdownMenu right>
        {branches.map(({ name, _id }, index) => (
          <MDBDropdownItem
            active={_id === onDuty._id}
            key={`branch-${index}`}
            onClick={() => changeBranch(_id, index)}
          >
            {capitalize(name)}
          </MDBDropdownItem>
        ))}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
