import React from 'react';
import { Upload, Modal,Icon, message  } from 'antd';
import {reqDeleteImg} from '../../api';
import PropTypes from 'prop-types';
import {BASE_IMG_URL} from '../../utils/constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  
    //初始显示imgs
  static propTypes={
      imgs:PropTypes.array
  }
  state = {
    previewVisible: false,//标识是否显示大图预览Modal
    previewImage: '',//大图的url
    previewTitle: '',
    fileList: [
    //   {
    //     uid: '-1',//每个file都有自己唯一的id
    //     name: 'image.png',//图片文件名
    //     status: 'done',//图片状态：done-已上传，uploading-正在上传中，removed-已删除
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    ],
  };


  constructor(props){
      super(props)
      let fileList=[]

      //如果传入了imgs属性
      const {imgs}=this.props
      if(imgs && imgs.length>0){
          fileList=imgs.map((img,index)=>({
              uid:-index,
              name:img,
              status:'done',
              url:BASE_IMG_URL + img
          }))
      }

      this.state={
          previewVisible:false,
          previewImage:'',
          fileList //所有已上传图片的数组
      }
  }
  /**获取所有已上传图片文件名的数组 */
  getImgs=()=>{
      return this.state.fileList.map(file=>file.name)
  }

  /**隐藏Modal */
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  /**file:当前操作的图片文件(上传/删除)
   * fileList:所有已上传图片文件对象的数组
   * 
   */
  handleChange = async({ file,fileList }) => {


    //一旦上传成功，将当前上传的file的信息修正(首先name信息不对等，其次缺少url，得从response里面获得)
    if(file.status==='done'){
        const result=file.response
        if(result.status===0){
            message.success('上传图片成功！')
            const{name,url}=result.data
            file=fileList[fileList.length-1]
            file.name=name
            file.url=url
        }else{
            message.error('上传图片失败！')
        }
    }else if(file.status==='removed'){
        //删除图片
        const result=await reqDeleteImg(file.name)
        if(result.status===0){
            message.success('删除图片成功！')
        }else{
            message.error('删除图片失败！')
        }
    }



    //在操作(上传/删除)过程中更新fileList状态，否则的话点击上传将会没有反应
      this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
        /**上传文件的地址 */
          action="/manage/img/upload"/**上传图片的接口地址 */
          accept='image/*'/**只接受图片格式 */
          name='image'/**请求参数名，必须指定，因为默认是file */
          listType="picture-card"/**图片的格式为卡片形式 */
          fileList={fileList}/**所有已上传图片文件对象的数组 */
          onPreview={this.handlePreview}/**点击文件链接或预览图标时的回调 */
          onChange={this.handleChange}/**上传中/完成/失败都会调用这个函数 */
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          /**点击加载大图Modal之后，点击取消的反应，即取消大图预览的效果 */
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

