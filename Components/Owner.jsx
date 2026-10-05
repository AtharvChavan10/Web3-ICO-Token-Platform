import React from "react";
import { FaPlus } from "react-icons/fa6";

const Owner = ({
  setOwnerModel,
  currency,
  detail,
  account,
  setTransferModel,
  setTransferCurrency,
  setOpenDonate,
  TOKEN_WITHDRAW,
  setOpenUpdatePrice,
  setOpenUpdateAddress,
}) => {
  const isOwner =
    account &&
    detail?.owner &&
    account.toLowerCase() === String(detail.owner).toLowerCase();
  const balanceLabel = detail?.maticBal
    ? `${Number(detail.maticBal).toFixed(4)} ${currency}`
    : `0.0000 ${currency}`;

  return (
    <section
      className="team pos-rel tool-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) setOwnerModel(false);
      }}
    >
      <div className="container">
        <div className="ico-contact__wrap new-owner">
          <div className="popup-header">
            <div />
            <h2 className="title">Tools</h2>
            <button
              type="button"
              className="popup-close"
              onClick={() => setOwnerModel(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="team__wrap ul_li tools-grid">
          <div className="team__item">
            <div className="avatar tool-glyph">⇄</div>

            <div className="team__info text-center mb-20">
              <h3>TOKEN TRANSFER</h3>
              <span>Any ERC 20</span>
            </div>

            <div className="team__social ul_li_center">
              <span
                onClick={() => (setOwnerModel(false), setTransferModel(true))}
                className="h-icon"
                style={{
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </span>
            </div>
          </div>
          <div className="team__item">
            <div className="avatar tool-glyph">Ξ</div>

            <div className="team__info text-center mb-20">
              <h3>TRANSFER FUND</h3>
              <span>{balanceLabel}</span>
            </div>

            <div className="team__social ul_li_center">
              <span
                onClick={() => (
                  setOwnerModel(false), setTransferCurrency(true)
                )}
                className="h-icon"
                style={{
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </span>
            </div>
          </div>
          <div className="team__item">
            <div className="avatar tool-glyph">♥</div>

            <div className="team__info text-center mb-20">
              <h3>DONATE FUND</h3>
              <span>If you can</span>
            </div>

            <div className="team__social ul_li_center">
              <span
                onClick={() => (setOwnerModel(false), setOpenDonate(true))}
                className="h-icon"
                style={{
                  cursor: "pointer",
                }}
              >
                <FaPlus />
              </span>
            </div>
          </div>

          {isOwner && (
            <>
              <div className="team__item">
                <div className="avatar tool-glyph">↓</div>

                <div className="team__info text-center mb-20">
                  <h3>WITHDRAW</h3>
                  <span>ICO TOKEN, Only Owner</span>
                </div>

                <div className="team__social ul_li_center">
                  <span
                    onClick={() => TOKEN_WITHDRAW()}
                    className="h-icon"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <FaPlus />
                  </span>
                </div>
              </div>

              <div className="team__item">
                <div className="avatar tool-glyph">T</div>

                <div className="team__info text-center mb-20">
                  <h3>UPDATE TOKEN</h3>
                  <span>ICO TOKEN, Only Owner</span>
                </div>

                <div className="team__social ul_li_center">
                  <span
                    onClick={() => (
                      setOwnerModel(false), setOpenUpdateAddress(true)
                    )}
                    className="h-icon"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <FaPlus />
                  </span>
                </div>
              </div>

              <div className="team__item">
                <div className="avatar tool-glyph">$</div>

                <div className="team__info text-center mb-20">
                  <h3>UPDATE TOKEN PRICE</h3>
                  <span>ICO TOKEN, Only Owner</span>
                </div>

                <div className="team__social ul_li_center">
                  <span
                    onClick={() => (
                      setOwnerModel(false), setOpenUpdatePrice(true)
                    )}
                    className="h-icon"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <FaPlus />
                  </span>
                </div>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Owner;
