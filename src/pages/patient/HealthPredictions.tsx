// AMMA Healthcare Platform - Health Predictions Page

import { useState } from 'react';
import {
  Brain,
  AlertTriangle,
  Check,
  Calendar,
  TrendingUp,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePatientStore, useAIStore } from '@/store';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function HealthPredictions() {
  const { predictions, markPredictionRead, markPredictionActioned } = usePatientStore();
  const { generatePrediction, isProcessing } = useAIStore();
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const unreadPredictions = predictions.filter(p => !p.isRead);
  const readPredictions = predictions.filter(p => p.isRead);

  const handleMarkRead = (id: string) => {
    markPredictionRead(id);
    toast.success('Marked as read');
  };

  const handleBookAppointment = (predictionId: string) => {
    markPredictionActioned(predictionId, `apt_${Date.now()}`);
    toast.success('Appointment booked successfully!');
    setIsBookingDialogOpen(false);
    setSelectedPrediction(null);
  };

  const handleGenerateNewPrediction = async () => {
    try {
      const prediction = await generatePrediction('profile_patient_1');
      if (prediction) {
        toast.success('New health prediction generated!');
      } else {
        toast.error('Prediction could not be generated. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while generating the prediction. Please try again later.');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-[#e92222] bg-[#fef2f2] border-[#e92222]';
      case 'high':
        return 'text-[#e92222] bg-[#fef2f2] border-[#e92222]';
      case 'medium':
        return 'text-[#faea73] bg-[#fefce8] border-[#faea73]';
      default:
        return 'text-[#00b67a] bg-[#f0fdf4] border-[#00b67a]';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Info className="w-5 h-5" />;
      default:
        return <Check className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f1f1f]">Health Predictions</h1>
          <p className="text-[#626a72]">AI-powered insights about your family's health</p>
        </div>
        <Button
          className="bg-[#0070a0] hover:bg-[#00577c]"
          onClick={handleGenerateNewPrediction}
          disabled={isProcessing}
        >
          <Brain className="w-4 h-4 mr-2" />
          {isProcessing ? 'Analyzing...' : 'Generate New Analysis'}
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-[#e6f7ff] rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#0070a0] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-[#0070a0]">
            Our AI analyzes your medical history, family data, and health patterns to predict potential risks.
            These predictions help you take preventive action before issues arise.
          </p>
        </div>
      </div>

      {/* Unread Predictions */}
      {unreadPredictions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#1f1f1f] mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#e92222]" />
            New Predictions ({unreadPredictions.length})
          </h2>
          <div className="space-y-4">
            {unreadPredictions.map((prediction) => (
              <Card
                key={prediction.id}
                className={`border-l-4 ${getSeverityColor(prediction.severity)}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(prediction.severity)}`}>
                        {getSeverityIcon(prediction.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[#1f1f1f]">{prediction.predictionType}</h3>
                          <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getSeverityColor(prediction.severity)}`}>
                            {prediction.severity}
                          </span>
                        </div>
                        <p className="text-[#626a72] mb-3">{prediction.description}</p>

                        <div className="flex items-center gap-4 text-sm text-[#99a4af]">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {Math.round(prediction.confidenceScore * 100)}% confidence
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Predicted {format(new Date(prediction.predictedAt), 'MMM d, yyyy')}
                          </span>
                        </div>

                        {prediction.riskFactors.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-[#1f1f1f] mb-2">Risk Factors:</p>
                            <div className="flex flex-wrap gap-2">
                              {prediction.riskFactors.map((factor, i) => (
                                <span key={i} className="px-2 py-1 bg-white border border-[#dee5eb] rounded text-xs text-[#626a72]">
                                  {factor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {prediction.recommendations.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-[#1f1f1f] mb-2">Recommendations:</p>
                            <ul className="space-y-1">
                              {prediction.recommendations.map((rec, i) => (
                                <li key={i} className="text-sm text-[#626a72] flex items-start gap-2">
                                  <Check className="w-4 h-4 text-[#00b67a] flex-shrink-0 mt-0.5" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {prediction.suggestedActions.length > 0 && (
                        <Button
                          size="sm"
                          className="bg-[#0070a0] hover:bg-[#00577c]"
                          onClick={() => {
                            setSelectedPrediction(prediction);
                            setIsBookingDialogOpen(true);
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Book Appointment
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkRead(prediction.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark as Read
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Predictions */}
      {readPredictions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#1f1f1f] mb-4">Past Predictions</h2>
          <div className="space-y-3">
            {readPredictions.map((prediction) => (
              <Card
                key={prediction.id}
                className="opacity-70 hover:opacity-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedPrediction(prediction)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(prediction.severity)}`}>
                        {getSeverityIcon(prediction.severity)}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#1f1f1f]">{prediction.predictionType}</h4>
                        <p className="text-sm text-[#626a72]">
                          {format(new Date(prediction.predictedAt), 'MMM d, yyyy')} • {' '}
                          {prediction.isActioned ? 'Actioned' : 'Read'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getSeverityColor(prediction.severity)}`}>
                      {prediction.severity}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {predictions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-[#dee5eb]" />
            <h3 className="text-lg font-medium text-[#1f1f1f] mb-2">No predictions yet</h3>
            <p className="text-[#626a72] mb-4">
              Our AI will analyze your health data and generate predictions here.
            </p>
            <Button
              className="bg-[#0070a0] hover:bg-[#00577c]"
              onClick={handleGenerateNewPrediction}
              disabled={isProcessing}
            >
              {isProcessing ? 'Analyzing...' : 'Generate First Analysis'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-[#626a72]">
              Based on the AI prediction for <strong>{selectedPrediction?.predictionType}</strong>,
              we recommend booking an appointment with a specialist.
            </p>

            <div className="p-4 bg-[#f7f9fa] rounded-lg">
              <p className="text-sm font-medium text-[#1f1f1f] mb-2">Recommended Doctors:</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border border-[#dee5eb]">
                  <div>
                    <p className="font-medium text-[#1f1f1f]">Dr. Priya Sharma</p>
                    <p className="text-sm text-[#626a72]">General Physician</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#0070a0] hover:bg-[#00577c]"
                    onClick={() => handleBookAppointment(selectedPrediction?.id)}
                  >
                    Book
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsBookingDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Prediction Detail Dialog */}
      <Dialog open={!!selectedPrediction && !isBookingDialogOpen} onOpenChange={() => setSelectedPrediction(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#0070a0]" />
              {selectedPrediction?.predictionType}
            </DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <div className="space-y-4 pt-4">
              {/* Severity & Confidence */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm rounded-full capitalize font-medium ${getSeverityColor(selectedPrediction.severity)}`}>
                  {selectedPrediction.severity} severity
                </span>
                <span className="text-sm text-[#626a72] flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {Math.round(selectedPrediction.confidenceScore * 100)}% confidence
                </span>
                <span className="text-sm text-[#99a4af]">
                  {format(new Date(selectedPrediction.predictedAt), 'MMM d, yyyy')}
                </span>
              </div>

              {/* Description */}
              <div className="p-4 bg-[#f7f9fa] rounded-lg">
                <p className="text-[#33383f] leading-relaxed">{selectedPrediction.description}</p>
              </div>

              {/* Risk Factors */}
              {selectedPrediction.riskFactors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#1f1f1f] mb-2">Risk Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrediction.riskFactors.map((factor: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-[#fef2f2] text-[#e92222] rounded-full text-xs font-medium">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedPrediction.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#1f1f1f] mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedPrediction.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-sm text-[#33383f] flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#00b67a] flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Actions */}
              {selectedPrediction.suggestedActions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#1f1f1f] mb-2">Suggested Actions</h4>
                  <ul className="space-y-2">
                    {selectedPrediction.suggestedActions.map((action: string, i: number) => (
                      <li key={i} className="text-sm text-[#33383f] flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#faea73] flex-shrink-0 mt-0.5" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {!selectedPrediction.isActioned && (
                  <Button
                    className="bg-[#0070a0] hover:bg-[#00577c]"
                    onClick={() => {
                      setIsBookingDialogOpen(true);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedPrediction(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
