import { Plugin } from '@uppy/core';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

/**
 * Send a POST request to the specified URL.
 *
 * @param {String}    url
 * @param {Object}    params                      Body parameters
 * @param {Object}    options
 * @param {Function}  [options.onUploadProgress]  Accepts one ProgressEvent argument
 * @return {Promise<String>} Resolves to the response text
 */
function sendPostRequest(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref = arguments.length > 2 ? arguments[2] : undefined,
      onUploadProgress = _ref.onUploadProgress;

  return new Promise(function (resolve, reject) {
    if (!url || typeof url !== 'string') {
      reject(new Error('URL must be a string.'));
    }

    if (!params || _typeof(params) !== 'object') {
      reject(new Error('Params must be an object.'));
    }

    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    Object.keys(params).forEach(function (key) {
      fd.append(key, params[key]);
    });
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    if (onUploadProgress && typeof onUploadProgress === 'function') {
      xhr.upload.addEventListener('progress', onUploadProgress);
    }

    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          // File uploaded successfully
          resolve(xhr.responseText);
        } else {
          reject();
        }
      }
    });
    xhr.addEventListener('error', function () {
      return reject();
    });
    xhr.send(fd);
  });
}

var baseUrl = 'https://api.cloudinary.com/v1_1';
/**
 * @param {File|Blob} file
 * @returns {String}
 */

function getResourceType(file) {
  if (file instanceof File) {
    if (file.type.match(/^image\//)) {
      return 'image';
    } else if (file.type.match(/^video\//)) {
      return 'video';
    }
  }

  return 'auto';
}
/**
 * @param {String}    cloudName
 * @param {File|Blob} file
 * @returns {String}
 */


function getUploadUrl(cloudName, file) {
  var type = getResourceType(file);
  return "".concat(baseUrl, "/").concat(cloudName, "/").concat(type, "/upload");
}
/**
 * Client for communicating with the Cloudinary API.
 */


var CloudinaryApiClient =
/*#__PURE__*/
function () {
  /**
   * @param {Object}    params
   * @param {String}    [params.cloudName]
   * @param {String}    [params.uploadPreset]
   * @param {String}    [params.apiKey]
   * @param {String}    [params.folder]
   * @param {String}    [params.cloudName]
   * @param {String[]}  [params.tags]
   * @param {Function}  [params.generateSignature]
   */
  function CloudinaryApiClient(_ref) {
    var cloudName = _ref.cloudName,
        uploadPreset = _ref.uploadPreset,
        apiKey = _ref.apiKey,
        folder = _ref.folder,
        tags = _ref.tags,
        generateSignature = _ref.generateSignature;

    _classCallCheck(this, CloudinaryApiClient);

    this.cloudName = cloudName;
    this.uploadPreset = uploadPreset;
    this.apiKey = apiKey;
    this.folder = folder;
    this.tags = tags;
    this.generateSignature = generateSignature;
  }
  /**
   * Uploads a file to Cloudinary.
   *
   * @param {File|Blob} file
   * @param {Object}    options
   * @param {Function}  [options.onUploadProgress] Accepts one ProgressEvent argument
   * @returns {Promise<Object>} JSON response data
   */


  _createClass(CloudinaryApiClient, [{
    key: "upload",
    value: function () {
      var _upload = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(file, _ref2) {
        var _ref2$onUploadProgres, onUploadProgress, params, signature, responseText;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _ref2$onUploadProgres = _ref2.onUploadProgress, onUploadProgress = _ref2$onUploadProgres === void 0 ? undefined : _ref2$onUploadProgres;
                params = {
                  upload_preset: this.uploadPreset,
                  folder: this.folder,
                  tags: this.tags.join(','),
                  timestamp: new Date().getTime()
                };
                _context.next = 4;
                return this.generateSignature(params);

              case 4:
                signature = _context.sent;

                if (signature) {
                  _context.next = 7;
                  break;
                }

                throw new Error('Could not generate signature');

              case 7:
                params.signature = signature;
                params.api_key = this.apiKey;
                params.file = file;
                _context.next = 12;
                return sendPostRequest(getUploadUrl(this.cloudName, file), params, {
                  onUploadProgress: onUploadProgress
                });

              case 12:
                responseText = _context.sent;
                return _context.abrupt("return", JSON.parse(responseText));

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function upload(_x, _x2) {
        return _upload.apply(this, arguments);
      }

      return upload;
    }()
  }]);

  return CloudinaryApiClient;
}();

/**
 * Uppy plugin that uploads selected files to Cloudinary.
 */

var CloudinaryPlugin =
/*#__PURE__*/
function (_Plugin) {
  _inherits(CloudinaryPlugin, _Plugin);

  /**
   * @param {Uppy}      uppy
   * @param {Object}    options
   * @param {String}    [options.id]
   * @param {String}    [options.cloudName]
   * @param {String}    [options.uploadPreset]
   * @param {String}    [options.apiKey]
   * @param {String}    [options.folder]
   * @param {String[]}  [options.tags]
   * @param {Function}  [options.generateSignature]
   */
  function CloudinaryPlugin(uppy, options) {
    var _this;

    _classCallCheck(this, CloudinaryPlugin);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CloudinaryPlugin).call(this, uppy, options));

    _initialiseProps.call(_assertThisInitialized(_this));

    var id = options.id,
        apiKey = options.apiKey,
        cloudName = options.cloudName,
        folder = options.folder,
        tags = options.tags,
        uploadPreset = options.uploadPreset,
        generateSignature = options.generateSignature;
    _this.id = id || 'CloudinaryPlugin';
    _this.type = 'uploader';
    _this.apiClient = new CloudinaryApiClient({
      apiKey: apiKey,
      cloudName: cloudName,
      folder: folder,
      tags: tags,
      uploadPreset: uploadPreset,
      generateSignature: generateSignature
    });
    return _this;
  }
  /**
   * @param {String} fileId
   * @returns {Promise<Object>}
   */


  _createClass(CloudinaryPlugin, [{
    key: "install",
    value: function install() {
      this.uppy.addUploader(this.uploadFiles);
    }
  }]);

  return CloudinaryPlugin;
}(Plugin);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.uploadFile =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(fileId) {
      var file, uploadStarted;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              file = _this2.uppy.getFile(fileId);
              uploadStarted = false;
              return _context.abrupt("return", _this2.apiClient.upload(file.data, {
                onUploadProgress: function onUploadProgress(event) {
                  if (!event.lengthComputable) {
                    return;
                  } // Inform uppy that the upload has started


                  if (!uploadStarted) {
                    _this2.uppy.emit('upload-started', file);

                    uploadStarted = true;
                  } // Inform Uppy instance of the current progress


                  _this2.uppy.emit('upload-progress', file, {
                    id: fileId,
                    uploader: _this2,
                    bytesUploaded: event.loaded,
                    bytesTotal: event.total
                  }); // Inform Uppy that the upload is finished


                  if (event.loaded >= event.total) {
                    _this2.uppy.emit('upload-complete', file);
                  }
                }
              }));

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  this.uploadFiles = function (fileIDs) {
    return Promise.all(fileIDs.map(
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(id) {
        var response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this2.uploadFile(id);

              case 2:
                response = _context2.sent;

                _this2.uppy.setFileState(id, {
                  response: response
                });

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }()).map(function (promise) {
      return promise.finally(function () {// Do nothing
      });
    }));
  };
};

// import 'babel-polyfill';

export default CloudinaryPlugin;
