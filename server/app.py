from flask import Flask, flash, redirect, render_template, request, url_for,jsonify
from werkzeug.utils import secure_filename
import torch
import os
from PIL import Image
from torchvision import transforms
from torch.autograd import Variable

UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif','bmp'])


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
model = None 
labels = {0: 'common', 1:'melanoma'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_file(filename):
    PATH = UPLOAD_FOLDER + filename
    img = Image.open(PATH)
    transforms_pipeline = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    img = transforms_pipeline(img)
    img = img.unsqueeze(0)  
    img = Variable(img)
    prediction = model(img)
    sm = torch.nn.Softmax()
    tensor_probabilities = sm(prediction) 

    prediction = prediction.data.numpy().argmax()
    probabilities = tensor_probabilities[0][prediction].data[0].tolist() 
    return labels[prediction], probabilities
    
@app.route('/predict', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        print('Entra aqui')
        # check if the post request has the file part
        print(request.form)
        file = request.files['file'] 
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            print('no tiene nombre')
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            label, probability = predict_file(filename)
            return jsonify({"prediction":label, "probability": probability})

if __name__ == '__main__':
    
    model = torch.load('models/resnet-50', map_location={'cuda:0': 'cpu'})
    model.to('cpu')
    model.eval()
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.run(debug=True,host='0.0.0.0')