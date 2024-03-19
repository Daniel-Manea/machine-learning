import ml5 from 'ml5';

export default ml5;
export const createImageClassifier = (model, video, options, callback) => {

  // Check if parameters are provided or use default values
  model = model || 'MobileNet';
  video = video || null;
  options = options || {};
  callback = callback || function() { console.log('Image Classifier model loaded'); };

  return ml5?.imageClassifier(model, video, options, callback);
}