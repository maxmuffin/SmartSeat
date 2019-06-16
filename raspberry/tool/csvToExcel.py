import pandas
import os

# Read csv file use pandas module.
def read_csv_file_by_pandas(csv_file):
    data_frame = None
    if(os.path.exists(csv_file)):
        data_frame = pandas.read_csv(csv_file)
        data_frame = data_frame.set_index('seduta1')
    else:
        print(csv_file + " do not exist.")
    return data_frame

# Write pandas.DataFrame object to a csv file.
def write_to_csv_file_by_pandas(csv_file_path, data_frame):
    data_frame.to_csv(csv_file_path)
    #print(csv_file_path + ' has been created.')

# Write pandas.DataFrame object to an excel file.
def write_to_excel_file_by_pandas(excel_file_path, data_frame):
    excel_writer = pandas.ExcelWriter(excel_file_path, engine='xlsxwriter')
    data_frame.to_excel(excel_writer, 'pressure sensors')
    excel_writer.save()
    #print(excel_file_path + ' has been created.')

# Sort the data in DataFrame object by name that data type is string.
def sort_data_frame_by_string_column(data_frame):
    data_frame = data_frame.sort_values(['timestamp'], inplace=True)


if __name__ == '__main__':

    folder = input("Inserisci la cartella contenente i csv da ordinare (0-8): ")

    data_frame = read_csv_file_by_pandas('../dataset/merged/'+folder+'/outputPosture'+folder+'.csv')

    print("Converting initial csv to xslx")
    write_to_excel_file_by_pandas('../dataset/merged/'+folder+'/outputPosture'+folder+'.xlsx', data_frame)
    sort_data_frame_by_string_column(data_frame)
    print("Sorting initial csv")
    write_to_csv_file_by_pandas('../dataset/merged/'+folder+'/SORTED_outputPosture'+folder+'.csv', data_frame)
    print("Converting sorted csv to xslx")
    write_to_excel_file_by_pandas('../dataset/merged/'+folder+'/SORTED_outputPosture'+folder+'.xlsx', data_frame)
    print("###### DONE ######")
