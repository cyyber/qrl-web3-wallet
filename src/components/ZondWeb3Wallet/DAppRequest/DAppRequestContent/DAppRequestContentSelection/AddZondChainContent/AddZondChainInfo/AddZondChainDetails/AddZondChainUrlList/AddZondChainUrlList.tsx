type AddZondChainUrlListProps = {
  title: string;
  urlList: string[];
};

const AddZondChainUrlList = ({ title, urlList }: AddZondChainUrlListProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div>{title}</div>
      {urlList.map((url) => (
        <div className="font-bold text-secondary">{url}</div>
      ))}
    </div>
  );
};

export default AddZondChainUrlList;
