/* eslint-disable max-len */
import styled from 'styled-components';

export function Footer() {
  return (
    <FooterWrapper>
      Powered By{' '}
      <a rel="noreferrer" target="_blank" href="https://novu.co?utm_source=in-app-widget" style={{ display: 'flex' }}>
        <svg width="107" height="16" viewBox="0 0 107 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M27.1333 12.3143C27.1333 12.7518 27.004 13.0998 26.7455 13.3584C26.4869 13.607 26.109 13.7313 25.6118 13.7313C25.4826 13.7313 25.3533 13.7164 25.224 13.6865C25.0948 13.6567 24.9555 13.602 24.8064 13.5225C24.6672 13.4429 24.5429 13.3683 24.4335 13.2987C24.3241 13.2291 24.1849 13.1247 24.0158 12.9855C23.8567 12.8363 23.7274 12.722 23.628 12.6424C23.5385 12.5529 23.3943 12.4137 23.1954 12.2248C22.9966 12.0358 22.8524 11.8966 22.7629 11.8071L20.0332 9.22664V12.4634C20.0332 12.9507 19.9388 13.2838 19.7498 13.4628C19.5708 13.6418 19.2825 13.7313 18.8847 13.7313C18.4472 13.7313 18.124 13.6319 17.9152 13.433C17.7063 13.2341 17.6019 12.901 17.6019 12.4336V5.22913C17.6019 4.66232 17.7461 4.23473 18.0345 3.94635C18.3229 3.65797 18.7355 3.51378 19.2725 3.51378C19.6404 3.51378 19.9338 3.57345 20.1526 3.69278C20.3813 3.80216 20.6498 4.00601 20.958 4.30434L24.7318 8.06319V4.81148C24.7318 4.38389 24.8362 4.06568 25.045 3.85685C25.2638 3.63809 25.5572 3.5287 25.9251 3.5287C26.3527 3.5287 26.6609 3.62814 26.8499 3.82702C27.0388 4.0259 27.1333 4.34908 27.1333 4.79657V12.3143ZM36.1544 11.643C36.4925 11.643 36.7808 11.4939 37.0195 11.1956C37.2681 10.8972 37.4421 10.5293 37.5416 10.0918C37.6509 9.65423 37.7056 9.18686 37.7056 8.68966C37.7056 8.18251 37.6509 7.7052 37.5416 7.25772C37.4322 6.80029 37.2532 6.41247 37.0046 6.09427C36.7659 5.77606 36.4825 5.61695 36.1544 5.61695C35.8361 5.61695 35.5577 5.77606 35.3191 6.09427C35.0804 6.41247 34.9014 6.80029 34.7821 7.25772C34.6628 7.71514 34.6031 8.19246 34.6031 8.68966C34.6031 9.18686 34.6578 9.65423 34.7672 10.0918C34.8865 10.5293 35.0655 10.8972 35.3041 11.1956C35.5527 11.4939 35.8361 11.643 36.1544 11.643ZM38.7945 13.2391C38.0089 13.6269 37.1239 13.8208 36.1394 13.8208C35.1649 13.8208 34.2849 13.6269 33.4993 13.2391C32.7237 12.8413 32.1022 12.2496 31.6348 11.4641C31.1674 10.6785 30.9337 9.75367 30.9337 8.68966C30.9337 7.07873 31.416 5.80092 32.3806 4.85623C33.3551 3.9016 34.613 3.42429 36.1544 3.42429C37.6957 3.42429 38.9536 3.9016 39.9281 4.85623C40.9026 5.80092 41.3899 7.07873 41.3899 8.68966C41.3899 9.75367 41.1512 10.6785 40.6739 11.4641C40.2066 12.2496 39.5801 12.8413 38.7945 13.2391ZM50.6882 11.4939C50.6882 12.0607 50.6186 12.5131 50.4794 12.8512C50.3402 13.1794 50.1463 13.4081 49.8977 13.5374C49.659 13.6667 49.3408 13.7313 48.943 13.7313C48.3563 13.7313 47.9287 13.5772 47.6602 13.2689C47.4017 12.9507 47.2675 12.3938 47.2575 11.5983L47.2277 6.09427H45.9598C45.3333 6.09427 44.861 5.99482 44.5428 5.79594C44.2345 5.59706 44.0804 5.24405 44.0804 4.7369C44.0804 4.42864 44.14 4.18501 44.2594 4.00602C44.3886 3.82702 44.5776 3.70272 44.8262 3.63311C45.0748 3.55356 45.4079 3.51378 45.8256 3.51378H52.2096C52.7665 3.51378 53.1692 3.61323 53.4178 3.81211C53.6664 4.01099 53.7907 4.35406 53.7907 4.84132C53.7907 5.16947 53.7162 5.42801 53.567 5.61695C53.4278 5.79594 53.2389 5.92024 53.0002 5.98985C52.7615 6.05946 52.4533 6.09427 52.0754 6.09427H50.6882V11.4939ZM61.0594 11.4939C61.0594 12.2695 60.9152 12.8363 60.6268 13.1943C60.3385 13.5523 59.9009 13.7313 59.3142 13.7313C58.7375 13.7313 58.3099 13.5772 58.0315 13.2689C57.763 12.9606 57.6287 12.4087 57.6287 11.6132V5.30371C57.6287 4.11043 58.1906 3.51378 59.3142 3.51378C59.891 3.51378 60.3236 3.62317 60.6119 3.84194C60.9103 4.06071 61.0594 4.50322 61.0594 5.16947V11.4939Z"
            fill="#333737"
          />
          <path
            d="M68.6108 11.658C68.6108 12.3342 68.4616 12.8512 68.1633 13.2092C67.865 13.5573 67.4324 13.7313 66.8656 13.7313C66.3286 13.7313 65.911 13.5722 65.6127 13.254C65.3143 12.9258 65.1652 12.3739 65.1652 11.5983V5.30371C65.1652 4.9855 65.205 4.71204 65.2845 4.48333C65.374 4.24467 65.4983 4.05574 65.6574 3.91652C65.8165 3.7773 65.9955 3.67786 66.1944 3.6182C66.3933 3.54859 66.617 3.51378 66.8656 3.51378H71.7581C72.3348 3.51378 72.7624 3.60328 73.0409 3.78227C73.3292 3.96127 73.4734 4.28445 73.4734 4.75182C73.4734 5.18936 73.3491 5.49762 73.1005 5.67662C72.8619 5.84566 72.4641 5.93019 71.9072 5.93019H68.6108V7.67537H71.236C71.5045 7.67537 71.7282 7.69526 71.9072 7.73503C72.0962 7.77481 72.2453 7.84442 72.3547 7.94386C72.4741 8.03335 72.5536 8.14771 72.5934 8.28693C72.6431 8.4162 72.668 8.58525 72.668 8.79407C72.668 9.13217 72.5437 9.3758 72.2951 9.52496C72.0465 9.66418 71.6487 9.73379 71.1018 9.73379H68.6108V11.658ZM80.5814 11.4939C80.5814 12.2695 80.4372 12.8363 80.1488 13.1943C79.8605 13.5523 79.4229 13.7313 78.8362 13.7313C78.2595 13.7313 77.8319 13.5772 77.5534 13.2689C77.285 12.9606 77.1507 12.4087 77.1507 11.6132V5.30371C77.1507 4.11043 77.7125 3.51378 78.8362 3.51378C79.413 3.51378 79.8455 3.62317 80.1339 3.84194C80.4322 4.06071 80.5814 4.50322 80.5814 5.16947V11.4939ZM90.4 6.48208C90.4 6.00477 90.226 5.67661 89.878 5.49762C89.5299 5.31863 88.9432 5.22913 88.1179 5.22913V7.80961C88.8935 7.80961 89.4653 7.71514 89.8332 7.52621C90.2111 7.32733 90.4 6.97929 90.4 6.48208ZM88.1179 11.4939C88.1179 12.9855 87.5361 13.7313 86.3727 13.7313C85.786 13.7313 85.3534 13.5772 85.075 13.2689C84.8065 12.9507 84.6723 12.3938 84.6723 11.5983V5.30371C84.6723 4.72696 84.8264 4.28942 85.1347 3.9911C85.4529 3.68283 85.8655 3.5287 86.3727 3.5287H89.5051C90.7282 3.5287 91.7176 3.81708 92.4734 4.39383C93.2291 4.96064 93.607 5.69153 93.607 6.5865C93.607 7.26269 93.4628 7.7947 93.1744 8.18251C92.896 8.56039 92.4435 8.83882 91.8171 9.01781C92.2944 9.04765 92.7369 9.28133 93.1446 9.71887C93.5523 10.1465 93.7561 10.6834 93.7561 11.3298C93.7561 11.9861 93.6915 12.4933 93.5622 12.8512C93.4429 13.1993 93.2689 13.433 93.0402 13.5523C92.8115 13.6716 92.4883 13.7313 92.0706 13.7313C91.4839 13.7313 91.0514 13.612 90.7729 13.3733C90.5044 13.1247 90.3702 12.7518 90.3702 12.2546C90.3702 11.6381 90.3105 11.1657 90.1912 10.8376C90.0719 10.4995 89.9177 10.2807 89.7288 10.1813C89.5399 10.0818 89.2763 10.0321 88.9383 10.0321L88.1179 10.047V11.4939ZM103.776 7.67537C104.303 7.67537 104.671 7.75989 104.879 7.92894C105.098 8.09799 105.208 8.38637 105.208 8.79407C105.208 9.13217 105.078 9.3758 104.82 9.52496C104.571 9.66418 104.178 9.73379 103.641 9.73379H101.225V11.3149L104.462 11.3298C105.019 11.3298 105.416 11.4143 105.655 11.5834C105.904 11.7425 106.028 12.0309 106.028 12.4485C106.028 12.9258 105.884 13.259 105.595 13.4479C105.317 13.6368 104.889 13.7313 104.313 13.7313H99.4798C98.8931 13.7313 98.4606 13.5772 98.1821 13.2689C97.9136 12.9507 97.7794 12.3938 97.7794 11.5983V5.30371C97.7794 4.11043 98.3462 3.51378 99.4798 3.51378H104.313C104.889 3.51378 105.317 3.60328 105.595 3.78227C105.884 3.96127 106.028 4.28445 106.028 4.75182C106.028 5.18936 105.904 5.49762 105.655 5.67662C105.416 5.84566 105.019 5.93019 104.462 5.93019H101.21V7.67537H103.776Z"
            fill="#CD5450"
          />
          <path
            d="M3.94407 8.43212C5.29243 10.1139 6.82073 12.0198 4.74649 14.8768C4.73307 14.8949 4.71302 14.9066 4.6907 14.9089C4.68791 14.9094 4.68529 14.9094 4.6825 14.9094C4.66315 14.9094 4.64432 14.9023 4.62984 14.8894C4.56934 14.8348 4.49628 14.771 4.41224 14.6976C3.4419 13.8496 0.864273 11.597 0.685201 8.77475C0.592264 7.30904 1.15354 5.88083 2.35265 4.52985C2.37758 4.50195 2.41856 4.49533 2.45099 4.51381C2.48359 4.53247 2.49824 4.57135 2.48656 4.60692C2.01752 6.02991 2.95316 7.19675 3.94407 8.43212V8.43212ZM10.1743 5.67368C10.1471 5.64927 10.1065 5.647 10.0763 5.66827C10.0463 5.68955 10.035 5.72861 10.0489 5.76261C11.6034 9.55974 9.54779 11.6906 7.16789 14.1581C6.76162 14.579 6.3421 15.0146 5.9313 15.4675C5.91247 15.4881 5.90584 15.5172 5.91439 15.5439C5.92258 15.5706 5.94455 15.5908 5.97193 15.5973C6.32571 15.6798 6.69972 15.7219 7.0842 15.7219H7.08489C9.44369 15.7219 11.8089 14.178 12.5868 12.1299C13.3768 10.0476 12.5205 7.75472 10.1743 5.67368V5.67368ZM7.06432 11.6652C7.05717 11.7002 7.07443 11.7355 7.10651 11.7517C7.11767 11.7571 7.12971 11.7599 7.14174 11.7599C7.16371 11.7599 7.18533 11.7505 7.20067 11.7334C10.089 8.47694 8.70474 6.60775 7.48332 4.95879C6.56843 3.72376 5.70428 2.55709 6.56041 0.921381C6.57836 0.887032 6.5686 0.844661 6.53739 0.821471C6.50618 0.79828 6.46241 0.801244 6.43521 0.828445C2.60652 4.58268 4.12593 6.3816 5.59582 8.12123C6.50217 9.19427 7.35847 10.2073 7.06432 11.6652V11.6652Z"
            fill="#CD5450"
          />
        </svg>
      </a>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.div`
  text-align: center;
  font-size: 8px;
  border-top: 1px solid #edf2f9;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  direction: ltr;

  svg {
    margin-left: 5px;
    width: 60px;
    position: relative;
    top: -1px;
  }
`;
