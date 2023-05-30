import Link from "next/link";

const LogoutConfirm = () => (
    <>
      <div className="saidan-logout-confirm-container-outer">
        <div className="saidan-logout-confirm-container-inner">
          <h3 className="saidan-logout-confirm-title">
            退出しますか？
          </h3>
          <div className="saidan-logout-confirm-p-container">
            <p className="saidan-logout-confirm-p">
              {/* ※SAIDANの編集内容は保存されません */}
            </p>
          </div>
          <div className="modal-action saidan-logout-confirm-btn-container">
            <label
              htmlFor="logout-confirm"
              className="saidan-logout-confirm-btn-cancel"
            >
              キャンセル
            </label>
            <Link href="/">
              <label
                htmlFor="logout-confirm"
                className="saidan-logout-confirm-btn-ok"
                onClick={() => {
                  // console.log('init')
                }}
              >
                OK
              </label>
            </Link>
          </div>
        </div>
      </div>
      {/* <label
            htmlFor={`logout-confirm`}
            className="modal cursor-pointer z-[2] bg-black/50" */}
      {/* > */}
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      {/* <label
                className="modal-box relative"
                htmlFor=""
                style={{ backgroundColor: WHITE_GRAY }}
            >
            </label>
        </label> */}
    </>
  );

export default LogoutConfirm;
