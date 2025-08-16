export interface CreditRiskData {
  amtinstpaidbefduel24m_4187115A: number;
  annuity_780A: number;
  annuitynextmonth_57A: number;
  avginstallast24m_3658937A: number;
  avglnamtstart24m_4525187A: number;
  avgoutstandbalancel6m_4187114A: number;
  avgpmtlast12m_4525200A: number;
  credamount_770A: number;
  currdebt_22A: number;
  currdebtcredtyperange_828A: number;
  disbursedcredamount_1113A: number;
  downpmt_116A: number;
  inittransactionamount_650A: number;
  lastapprcommoditycat_1041M: number;
  lastapprcommoditytypec_5251766M: number;
  lastapprcredamount_781A: number;
  lastcancelreason_561M: number;
  lastotherinc_902A: number;
  lastotherlnsexpense_631A: number;
  lastrejectcommoditycat_161M: number;
  lastrejectcommodtypec_5251769M: number;
  lastrejectcredamount_222A: number;
  lastrejectreason_759M: number;
  lastrejectreasonclient_4145040M: number;
  maininc_215A: number;
  maxannuity_159A: number;
  maxannuity_4075009A: number;
  maxdebt4_972A: number;
  maxinstallast24m_3658928A: number;
  maxlnamtstart6m_4525199A: number;
  maxoutstandbalancel12m_4187113A: number;
  maxpmtlast3m_4525190A: number;
  previouscontdistrict_112M: number;
  price_1097A: number;
  sumoutstandtotal_3546847A: number;
  sumoutstandtotalest_4493215A: number;
  totaldebt_9A: number;
  totalsettled_863A: number;
  totinstallast1m_4525188A: number;
  description_5085714M: number;
  education_1103M: number;
  education_88M: number;
  maritalst_385M: number;
  maritalst_893M: number;
  pmtaverage_3A: number;
  pmtaverage_4527227A: number;
  pmtaverage_4955615A: number;
  pmtssum_45A: number;
}

export interface CreditRiskRequest {
  data: CreditRiskData;
  threshold: number;
}

export interface CreditRiskResponse {
  prediction: number;
  probability: number;
  risk_level: 'low' | 'medium' | 'high';
}