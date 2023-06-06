import { NextPage } from "next";

const FontTest: NextPage = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-accent">Redeem Code</h1>
      <h3 className="font-bold text-primary">Activity Record</h3>
      <p className="text-primary">TOBIRA NEKOを購入した</p>
      <p className="text-accent">How to receive NFTs</p>
      <button className="btn btn-accent">Redeem</button>
      <button className="btn btn-secondary">Redeem</button>
      <p className="text-error font-bold">The Redemption Code is incorrect.</p>

      <>
        {/* The button to open modal */}
        <label htmlFor="my-modal-3" className="btn">
          open modal
        </label>

        {/* Put this part before </body> tag */}
        <input type="checkbox" id="my-modal-3" className="modal-toggle" />
        <div className="modal bg-black/50">
          <div className="modal-box bg-base-100 relative">
            <label
              htmlFor="my-modal-3"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </label>
            <h3 className="text-accent text-2xl font-bold">Error</h3>
            <p className="text-error font-bold py-4">
              The Redemption Code is innorrect.
            </p>
            <button className="btn btn-wide btn-circle btn-secondary">
              Redeem
            </button>
          </div>
        </div>
      </>
    </>
  );
};

export default FontTest;
