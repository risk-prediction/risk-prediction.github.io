import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { CreditRiskData, CreditRiskRequest, CreditRiskResponse } from '@/types/api';
import { predictCreditRisk } from '@/utils/api';
import { positiveSample, negativeSample } from '@/data/samples';

const fieldLabels: Record<keyof CreditRiskData, string> = {
  amtinstpaidbefduel24m_4187115A: 'Amount Installment Paid Before Due (24M)',
  annuity_780A: 'Annuity',
  annuitynextmonth_57A: 'Annuity Next Month',
  avginstallast24m_3658937A: 'Average Installments Last 24M',
  avglnamtstart24m_4525187A: 'Average Loan Amount Start 24M',
  avgoutstandbalancel6m_4187114A: 'Average Outstanding Balance Last 6M',
  avgpmtlast12m_4525200A: 'Average Payment Last 12M',
  credamount_770A: 'Credit Amount',
  currdebt_22A: 'Current Debt',
  currdebtcredtyperange_828A: 'Current Debt Credit Type Range',
  disbursedcredamount_1113A: 'Disbursed Credit Amount',
  downpmt_116A: 'Down Payment',
  inittransactionamount_650A: 'Initial Transaction Amount',
  lastapprcommoditycat_1041M: 'Last Approved Commodity Category',
  lastapprcommoditytypec_5251766M: 'Last Approved Commodity Type',
  lastapprcredamount_781A: 'Last Approved Credit Amount',
  lastcancelreason_561M: 'Last Cancel Reason',
  lastotherinc_902A: 'Last Other Income',
  lastotherlnsexpense_631A: 'Last Other Loan Expense',
  lastrejectcommoditycat_161M: 'Last Reject Commodity Category',
  lastrejectcommodtypec_5251769M: 'Last Reject Commodity Type',
  lastrejectcredamount_222A: 'Last Reject Credit Amount',
  lastrejectreason_759M: 'Last Reject Reason',
  lastrejectreasonclient_4145040M: 'Last Reject Reason Client',
  maininc_215A: 'Main Income',
  maxannuity_159A: 'Max Annuity',
  maxannuity_4075009A: 'Max Annuity Alt',
  maxdebt4_972A: 'Max Debt 4',
  maxinstallast24m_3658928A: 'Max Installments Last 24M',
  maxlnamtstart6m_4525199A: 'Max Loan Amount Start 6M',
  maxoutstandbalancel12m_4187113A: 'Max Outstanding Balance Last 12M',
  maxpmtlast3m_4525190A: 'Max Payment Last 3M',
  previouscontdistrict_112M: 'Previous Contract District',
  price_1097A: 'Price',
  sumoutstandtotal_3546847A: 'Sum Outstanding Total',
  sumoutstandtotalest_4493215A: 'Sum Outstanding Total Estimated',
  totaldebt_9A: 'Total Debt',
  totalsettled_863A: 'Total Settled',
  totinstallast1m_4525188A: 'Total Installments Last 1M',
  description_5085714M: 'Description',
  education_1103M: 'Education',
  education_88M: 'Education Alt',
  maritalst_385M: 'Marital Status',
  maritalst_893M: 'Marital Status Alt',
  pmtaverage_3A: 'Payment Average',
  pmtaverage_4527227A: 'Payment Average Alt',
  pmtaverage_4955615A: 'Payment Average Alt 2',
  pmtssum_45A: 'Payments Sum',
};

export default function CreditRiskForm() {
  const [formData, setFormData] = useState<CreditRiskData>(() => {
    const initialData: CreditRiskData = {} as CreditRiskData;
    Object.keys(fieldLabels).forEach(key => {
      initialData[key as keyof CreditRiskData] = 0;
    });
    return initialData;
  });
  
  const [threshold, setThreshold] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CreditRiskResponse | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof CreditRiskData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLoadSample = (sampleType: 'positive' | 'negative') => {
    const sampleData = sampleType === 'positive' ? positiveSample : negativeSample;
    setFormData(sampleData);
    toast({
      title: `${sampleType === 'positive' ? 'Positive' : 'Negative'} Sample Loaded`,
      description: `Sample data for ${sampleType === 'positive' ? 'low risk' : 'high risk'} profile has been loaded.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const request: CreditRiskRequest = {
        data: formData,
        threshold: threshold
      };

      const response = await predictCreditRisk(request);
      setResult(response);
      
      toast({
        title: 'Prediction Complete',
        description: `Risk assessment completed with ${(response.probability * 100).toFixed(1)}% confidence.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get prediction. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-risk-high';
      default:
        return 'text-foreground';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <TrendingUp className="h-6 w-6 text-success" />;
      case 'medium':
        return <AlertTriangle className="h-6 w-6 text-warning" />;
      case 'high':
        return <TrendingDown className="h-6 w-6 text-risk-high" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Home Credit Risk Assessment
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analyze credit risk using advanced machine learning algorithms. Input customer data to get instant risk predictions.
        </p>
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        <Button 
          variant="outline" 
          onClick={() => handleLoadSample('positive')}
          className="bg-success/10 border-success/30 hover:bg-success/20"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Load Positive Sample
        </Button>
        <Button 
          variant="outline" 
          onClick={() => handleLoadSample('negative')}
          className="bg-destructive/10 border-destructive/30 hover:bg-destructive/20"
        >
          <TrendingDown className="mr-2 h-4 w-4" />
          Load Negative Sample
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Customer Data Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Risk Threshold: {threshold}
                    </Label>
                    <Slider
                      value={[threshold]}
                      onValueChange={(value) => setThreshold(value[0])}
                      max={1}
                      min={0}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                  {Object.entries(fieldLabels).map(([field, label]) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="text-sm font-medium">
                        {label}
                      </Label>
                      <Input
                        id={field}
                        type="number"
                        value={formData[field as keyof CreditRiskData]}
                        onChange={(e) => handleInputChange(field as keyof CreditRiskData, parseFloat(e.target.value) || 0)}
                        className="w-full"
                        step="any"
                      />
                    </div>
                  ))}
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Predict Credit Risk'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {result && (
            <Card className="shadow-lg border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getRiskIcon(result.risk_level)}
                  Risk Assessment Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">
                    {(result.probability * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Risk Probability
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Risk Level:</span>
                    <span className={`font-bold capitalize ${getRiskColor(result.risk_level)}`}>
                      {result.risk_level}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Prediction:</span>
                    <span className="font-bold">
                      {result.prediction === 1 ? 'Default Risk' : 'No Default Risk'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <strong>Assessment:</strong> Based on the provided data, 
                    {result.risk_level === 'low' && ' this customer presents a low risk profile with good repayment indicators.'}
                    {result.risk_level === 'medium' && ' this customer presents a moderate risk profile requiring careful consideration.'}
                    {result.risk_level === 'high' && ' this customer presents a high risk profile with concerning financial indicators.'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quick Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong>Positive Sample:</strong> Low-risk customer with good payment history and stable income.
              </div>
              <div>
                <strong>Negative Sample:</strong> High-risk customer with payment issues and high debt ratios.
              </div>
              <div>
                <strong>Threshold:</strong> Adjust the risk threshold to change sensitivity of the model.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}