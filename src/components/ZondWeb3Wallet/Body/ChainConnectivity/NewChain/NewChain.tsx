import { Button } from "@/components/UI/Button";
import { ROUTES } from "@/router/router";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const NewChain = () => {
  return (
    <Link to={ROUTES.ADD_EDIT_CHAIN} state={{ hasState: true }}>
      <Button className="flex w-full gap-2">
        <Plus size="18" /> Add a custom blockchain
      </Button>
    </Link>
  );
};

export default NewChain;
