import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../Shared/BackButton/BackButton";
import { ROUTES } from "@/router/router";

const AddChain = observer(() => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const hasState = !!state?.hasState;

  useEffect(() => {
    if (!hasState) {
      navigate(ROUTES.CHAIN_CONNECTIVITY);
    }
  }, [hasState]);

  return (
    hasState && (
      <div className="flex flex-col gap-2 p-8">
        <BackButton />
        <div className="flex flex-col gap-8">add new chain</div>
      </div>
    )
  );
});

export default AddChain;
